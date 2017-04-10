

function Beam() {
	//instantiations
	//Array of Members
	var sp = new spMatrices();
	var members = new Array(); //cannot be called

	var parts = new Array();

	function ceil(_max, oldmax){
		abs = Math.abs(_max);
		if (oldmax < abs)
			return abs;
		return oldmax;
	}
	var react_Est = {
		momentCeil:0,
		shearCeil:0,
		shearB4Ceil:0,
		deflectCeil:0
	};
	this.est;
	this.partition = function(deci){
		// console.log(deci);
		if(parts.length!==0){
			return parts;
		}
		if (deci===null || deci===undefined){
			deci=0.05; // a meter divided to parts
		}
		var len = this.getTotalLength()/1000;
		var x,mem,obj;
		// console.log('len',len);

		for (var i=0; i<=len; i+=deci){
			var _i = parseFloat(i.toFixed(2));
			x = this.stressesOn(_i);

			//do estimates here.
		react_Est = {
			momentCeil:ceil(x.momentforce, react_Est.momentCeil),
			shearCeil:ceil(x.shearforce, react_Est.shearCeil),
			shearB4Ceil:ceil(x.shearforceb4, react_Est.shearB4Ceil),
			deflectCeil:ceil(x.deflection, react_Est.deflectCeil)
		}

			obj = { 
				_i, // i = a step in beam
				x 
			}
			parts.push(obj);
		}

		this.est = react_Est;
		// console.log(this.msc());
		return parts;
	}

	this.getMembers = function(){
		return members;
	}

	var joints = new Array();

	this.getJoints = function(){
		return joints;
	}
	var coor = new Array(); //2D info of coordinates //joint place, coordinate, isFree
	// coor.fill(new Array);
	this.coordinateList = function(){ //rechange this.
		if(coor.length === joints.length * 2){
			return coor;
		}
		var temp = new Array();
		var mat = new Array(); 
		for (var i = 0; i < joints.length; i++) {
			mat.push([ i, "y", !joints[i].vertRestrict]);
			mat.push([ i, "r", !joints[i].rotateRestrict])
		};
		// console.log(mat);
		coor = mat;
		return coor;
	};

	this.connectMJ = function(){
		if (!this.isMJBalance()){
			throw new Error("Not balanced to connect");
		}
		for (var i = 0; i < members.length; i++) {
			members[i].jointA = joints[i];
			members[i].jointB = joints[i+1];
			members[i].load = loads[i];
		}
		// this.coordinateList();
	};

	this.checkMJConnect=function(){
		if (!this.isMJBalance){
			throw new Error("Not balanced to check");
		}
		// check if members array and joints are connected
		for (var i = 0; i < members.length; i++) {
			if (members[i].jointA !== joints[i] || members[i].jointB !== joints[i+1])
				return false;
		};
		return true;
	};

	this.isMJBalance = function(){
		if(members === undefined || joints === undefined)
			return "empty members or joint arrays";
		return members.length === loads.length || (members.length + 1) === joints.length;
	};

	//array of loads
	var loads = new Array();

	this.getLoads = function(){
		return loads;
	}

	this.setMJ = function(memArr, jointArr, loadArr){
		members = memArr;
		joints = jointArr;
		loads = loadArr;
	}
	//Identify P[], Pf[], S[], dis[] are for freecoordinates only
		//P[] = applied forces in joints, typically 0;
	var appliedForces = new Array();
	this.getAppForces = function(){
		if (coor.length === appliedForces.length){
			return appliedForces;
		}
		var fc = new Array(); // must get: force value (N-mm/N) with direction = +/- x, which joint=[i], position = "y" or "r";
		var force;
		for (var i = 0; i < joints.length; i++) {
			if(!joints[i].vertRestrict){
				// add the force
				if(joints[i].hasVertForce){
					for (var j = 0; j < joints[i].jointForces.length; j++) {
						if (joints[i].jointForces[j].axialForce === "y"){
							fc.push(joints[i].jointForces[j].force);
						}
					};
				} else {
					fc.push(0);
				}
				fc.push(i);
				fc.push("y");
				appliedForces.push(fc);
				fc = new Array();
			}

			if(!joints[i].rotateRestrict){
				if(joints[i].hasRotForce){
					for (var j = 0; j < joints[i].jointForces.length; j++) {
						if (joints[i].jointForces[j].axialForce === "r"){
							fc.push(joints[i].jointForces[j].force);
						}
					};
				} else {
					fc.push(0);
				}
				fc.push(i);
				fc.push("r");
				appliedForces.push(fc);
				fc = new Array();
			}


		};
		return appliedForces;
	}; //end getAppForces

		//Pf[] = Sums of FEArray(Members);
	var fixedEndMoments = new Array();
	this.solvePf = function(){
		// if (coor.length === fixedEndMoments.length){
		// 	return appliedForces;
		// }
		var temp = new Array();
		var x;
		if(this.checkMJConnect()){
			for (var i = 0; i < members.length; i++) {
				if (temp.length <= 0){
					temp = members[i].getQfixedEnd();
				} else {
					// x = ;
					temp = sp.addArray(temp, members[i].getQfixedEnd(), temp.length - 2);
				}
			};
		}
		//strip non freecoor
		if(temp.length !== coor.length){
			throw new Error("Something Wrong. Equal coordinates");
		}
		var temp2 = new Array();
		for (var i = 0; i < coor.length; i++) {
			if(coor[i][2]){
				temp2.push(temp[i]);
			}
		};
		fixedEndMoments = temp2;
		return fixedEndMoments;
	}; //end of FEMs
 
	//S[] = Sums of KMatrix(Members) ? (Values fall on freecoordinates only);
	var sumKm = new Array();
	this.sumKmatrix = function(){
		if (sumKm.length === coor.length){
			return sumKm;
		}

		//add all KMatrix values
		var tempSum = new Array();
		for (var i = 0; i < members.length; i++) {
			if (tempSum.length <= 0){
				tempSum = members[i].getKMatrix();
			} else {
				tempSum = sp.mergeAdd(tempSum, members[i].getKMatrix(), (tempSum.length-2));
			}
		};
		//isolate free coordinates
		var temp = new Array();
		var temp2Sum = new Array();
		if(tempSum.length !== coor.length){
			throw new Error("Something Wrong. Equal coordinates");
		}

		for (var j = 0; j < tempSum.length; j++) {
			if(coor[j][2]){
				for (var i = 0; i < tempSum[j].length; i++) {
					if(coor[i][2]){
						temp.push(tempSum[j][i]);
					}
				};
				temp2Sum.push(temp);
				temp = new Array();
			}
		};
		sumKm = temp2Sum;
		return sumKm;
	};

	var disSet = new Array(); // free coor only
	var disAll = new Array();	// all displacement
	var disPerMember = new Array(); // displacement on members

	this.solveDisplacement = function(){
		if(disSet.length === coor.length){
			return disSet;
		}
		if(appliedForces.length !== fixedEndMoments.length){
			throw new Error("Empty AppForces and FEmoments. Solve them first");
		}
		if(sumKm==undefined){
			throw new Error('missing sumKm');
		}

		var invS = sp.inverse(sumKm); //
		var newP = new Array();
		var a,b;
		for (var i = 0; i < appliedForces.length; i++) {
			if(appliedForces[i][2] === "y"){
				a = appliedForces[i][0] * 1000;
				b = fixedEndMoments[i] * 1000;
			}else if(appliedForces[i][2] === "r") {
				a = appliedForces[i][0] * 1000000;
				b = fixedEndMoments[i] * 1000000;
			}
			newP.push(a - b); //converted to N-mm //careful
			// console.log(a+' - '+b);
		};
		// console.log('P-Pf:', newP);
		disSet = sp.multiply(invS, newP); //returns array of nonzero displacement
		
		//connect to coordinate list
		var count=0;
		for (var i = 0; i < coor.length; i++) {
			if(coor[i][2]){
				disAll.push(disSet[count++]);
			} else {
				// console.log(this.allDisplacement);
				disAll.push(0);
			}
		};
		//distribute to disPerMember
		var count, ind;
		var arr = new Array();
		for (var i = 0; i < members.length; i++) {
			ind = i+i;
			count = 0;
			while(arr.length != 4){
				arr.push(disAll[ind + count]);
				count++;
			}
			disPerMember.push(arr);
			arr = new Array();
		};
		return disSet;
	};

	//final
		//P = Qsum on free coordinates
	var allQ = new Array();
	var Yreact = new Array();
	var Rreact = new Array();
	var allReact = new Array(); //arranged
	this.solvePR = function(){
		if(allQ.length === coor.length){
			return allQ;
		}
		var temp = new Array(coor.length);
		// var count = 0;
		for (var i = 0; i < members.length; i++) {
			var tempQ = members[i].getQ();
			var ind = i+i;
			for (var j = 0; j < tempQ.length; j++) {
				if(tempQ[j]===-0){
					tempQ[j] = 0;
				}
				if(coor[ind + j][2]){ // sayop nasad diri.. care. p. 236
					if(temp[ind + j] === undefined){
					}
						var x = tempQ[j];
						if(j==3){
							x = -x;
						}
						temp[ind + j] =x;	

				} else {
					if (temp[ind + j] === undefined){
						temp[ind + j] = tempQ[j];
					} else {
						temp[ind + j] = temp[ind + j] + tempQ[j];
					}
				}
			};
		};
		for (var i = 0; i < temp.length; i++) {
			// temp[i]
			if(i%2===0){
				Yreact.push(temp[i]);
			} else {
				Rreact.push(temp[i]);
			}
		}
		for (var i = 0; i < joints.length; i++) {
			var c = {
				y:Yreact[i],
				r:Rreact[i]
			}
			allReact.push(c);
		}
		allQ = temp;
		return allQ;
	};

	this.getReact = function(opt){
		if (opt === 'y'){
			return Yreact;
		} else if (opt === 'r'){
			return Rreact;
		} else return allReact;
	}
	this.getMemberCalc = function(calc,index){
		switch(calc){
			case 'kmatrix':
				return members[index].getKMatrix();
			break;
			case 'qf':
				return members[index].getQfixedEnd();
			break;
			case 'ku':
				return members[index].getKU();
			break;
			case 'Q':
				return members[index].getQ();
			break;
			case 'displacement':
				return disPerMember[index];
			break;
			default:
				return {
					kmatrix: members[index].getKMatrix(),
					qf: members[index].getQfixedEnd(),
					ku: members[index].getKU(),
					Q: members[index].getQ(),
					displace: disPerMember[index]
				};
			break;
		}
	}

	this.getTotalLength = function(){
		var total = 0;
		$(members).each(function(ind,obj){
			total += obj.eil.len;
		});
		return total;
	}

	this.msc = function(){
		function findShortLength(){
			if(members.length <= 0){
				throw new Error('Empty Member List');
			}
			var min, thisObj, thisInd;
			$(members).each(function(ind, obj){
				if(obj.eil.lenInMeters < min || ind===0){
					min = obj.eil.lenInMeters;
					thisObj = obj;
					thisInd = ind;
				} 
			});
			min = parseInt(min.toFixed());
			return {
				min,
				thisObj,
				thisInd
			}
		}

		return {
			totalLength: this.getTotalLength() / 1000,
			shortestLength: findShortLength().min,
		}
	} //end of Msc

	function findMember(x){
			var l=0,obj;
			$(members).each(function(ind,object){
				if(x>=l && x<=l+object.eil.lenInMeters) {
					obj = object;
				}
				l+= object.eil.lenInMeters;
			});
			return obj;
	}

	this.stressesOn = function(x_coor){
		//helpers
		var totalLength = this.getTotalLength();

		var areaForce = { 
			/* l = member length; ld = member load; x = member length or directx; x2=0 or total traveled lengths.
			*/
			equally:function(l,ld,x,x2){
				return ld*(x-x2);
			},left_con:function(l,ld,x,x2){
				var area = (ld + (ld * ((x2+l - x)/l) ))/2;
				if(x2 == 0 && x == l){
					return (ld*l)/2;
				} else {
					area = ((ld*l)/2)-(((l+x2-x)*(ld-(ld*((x-x2)/l))))/2);// type 3; basin sakto ni.
					return area;
				}
			},right_con:function(l,ld,x,x2){
				var area = (ld * (x-x2))/l;
				if(x2 == 0 && x == l){
					return (ld*l)/2;
				} else {
					area =  (ld*((x-x2)/l)*(x-x2))/2;
					return area;
				}
			},c_point:function(l,ld,x,x2){ //sayop?
				var mid = l/2;
				if ((x-x2) >= mid) return ld;
				return 0;
			},two_point:function(l,ld,x,x2){
				var _x = (x-x2);
				var point = l/3;
				if (_x > point && _x < point*2 || _x == point) return ld;
				else if (_x >= point*2) return ld+ld;
				return 0;
			},noload:function(l,ld,x,x2){
				return 0;
			}
		}

		var momentArm = { 
			equally:function(l,ld,x,x2){
		        return (x - x2)/2;
	      	},left_con:function(l,ld,x,x2){
	          return (x - x2)*2/3;//original
	        },right_con:function(l,ld,x,x2){
	          return (x - x2)/3; //original
	        },c_point:function(l,ld,x,x2){
	          return x-((l/2) + x2); //original
	        },two_point:function(l,ld,x,x2){
	          return x-x2;
	        },noload:function(l,ld,x,x2){
	          return x-x2;
	        }
		}

		//builtins
		function getRandomArbitrary(min, max) {
		  return Math.random() * (max - min) + min;
		}
		var memTemp = findMember(x_coor);

		var shearb4elm=0;
		function shear(x){
			if(x === undefined){
				x = x_coor;
			}
			var total=0,
			tLength = 0;
			$(Yreact).each(function(ind,elm){
				if(tLength>x) {
					return false;
				} 
				shearb4elm=total;
				total += elm;

				var c = members[ind];
				if(c !== undefined){
					if(c.load.type !== 'noload'){
						if (x>c.eil.lenInMeters+tLength) 
							total -= areaForce[c.load.type](c.eil.lenInMeters,c.load.load,c.eil.lenInMeters,0);
						else 
							total -= areaForce[c.load.type](c.eil.lenInMeters,c.load.load,x,tLength);
					}
					// console.log('testAreaforce',areaForce[c.load.type](c.eil.lenInMeters,c.load.load,x_coor,tLength));
					tLength += c.eil.lenInMeters;
				}
			});
			total = parseFloat(total.toFixed(2));
			return total;
		}

		function dividedMembers(){
			var arr=[],tlength=0;
			// var tempY = 0;
			var temp;
			var tempShear = 0; //usefull only as shearb4elm in shear();
			var pushBy = { 
				equally:function(i,y,l,len,tlen,noX){ //done i think, probs. dili mu effect ang second
					// console.log("before",react,y);
					react += y;
					// console.log("after",react,y);
					tempShear += (y - (noX ? areaForce['equally'](len,l,x_coor,tlen) : areaForce['equally'](len,l,len,0)));
					temp = (noX ? areaForce['equally'](len,l,x_coor,tlen) : areaForce['equally'](len,l,len,0)) * (noX ? momentArm['equally'](len,l,x_coor,tlen) : momentArm['equally'](len,l,len,0));
					arr.push({
						xstep:(noX ? x_coor-tlen : len),
						index:i,
						yreact: react,
						shearF: tempShear, //equal to shear,
						arm: temp,
					});
					if(!noX){
						react -= areaForce['equally'](len,l,len,0);
					} //equal
		     	},left_con:function(i,y,l,len,tlen,noX){ //almost pero probably not.
		     		tempShape = {
		     			base: len,
		     			height: l,
		     			base2: noX ? x_coor-tlen : len,
		     			height2: l - ((l/len) * (noX ? x_coor-tlen : len)),
		     			triHeight: (l/len) * (noX ? x_coor-tlen : len)
		     		}
		     		tsCalc = {
		     			recArea: tempShape.base2 * tempShape.height2,
		     			recArm: tempShape.base2/2,
		     			tArea: tempShape.base2 * tempShape.triHeight / 2,
		     			tArm: tempShape.base2*2/3
		     		}
		     		// console.log('shape',tempShape,tsCalc);
		     		// console.log('arm', -(tsCalc.recArea *tsCalc.recArm)-(tsCalc.tArm *tsCalc.tArea));
					react += y;
					tempShear -= y - (noX ? areaForce['left_con'](len,l,x_coor,tlen) : areaForce['left_con'](len,l,len,0));
					// temp = (noX ? areaForce['left_con'](len,l,x_coor,tlen) : areaForce['left_con'](len,l,len,0)) * (noX ? momentArm['left_con'](len,l,x_coor,tlen) : momentArm['left_con'](len,l,len,0));
					temp = (tsCalc.recArea *tsCalc.recArm)+(tsCalc.tArm *tsCalc.tArea);
					// console.log('areaforce',(noX ? areaForce['left_con'](len,l,x_coor,tlen) : areaForce['left_con'](len,l,len,0)),'arm',(noX ? momentArm['left_con'](len,l,x_coor,tlen) : momentArm['left_con'](len,l,len,0)));
					arr.push({
						xstep:(noX ? x_coor-tlen : len),
						index:i,
						yreact:react,
						shearF:tempShear,
						arm: temp,
						// arm: momentArm['left_con'](len,l,x_coor,tlen),
					});
					if(!noX){
						react -= areaForce['left_con'](len,l,len,0);
					} //equal
		        },right_con:function(i,y,l,len,tlen,noX){ //sakto man ata
					react += y;
					tempShear -= y - (noX ? areaForce['right_con'](len,l,x_coor,tlen) : areaForce['right_con'](len,l,len,0));
					temp = (noX ? areaForce['right_con'](len,l,x_coor,tlen) : areaForce['right_con'](len,l,len,0)) * (noX ? momentArm['right_con'](len,l,x_coor,tlen) : momentArm['right_con'](len,l,len,0));
					// console.log('areaforce',(noX ? areaForce['right_con'](len,l,x_coor,tlen) : areaForce['right_con'](len,l,len,0)),'arm',(noX ? momentArm['right_con'](len,l,x_coor,tlen) : momentArm['right_con'](len,l,len,0)));
					arr.push({
						xstep:(noX ? x_coor-tlen : len),
						index:i,
						yreact:react,
						shearF:tempShear,
						arm: temp,
					});
					if(!noX){
						// console.log('hello',react,-areaForce['right_con'](len,l,len,0));
						react -= areaForce['right_con'](len,l,len,0);
						// console.log("new react",react);
					}
		        },c_point:function(i,y,l,len,tlen,noX){
		        	react += y;
		        	tempShear += (y - (noX ? areaForce['c_point'](len,l,x_coor,tlen) : areaForce['c_point'](len,l,len,0)));
					if(x_coor>tlen+len){
						react -= areaForce['c_point'](len,l,0,0);
						arr.push({
							xstep:len/2,
							index:i,
							yreact:react,
							areaF: -areaForce['c_point'](len,l,0,0),
							shearF: tempShear
						});
						react -= areaForce['c_point'](len,l,len,0);
						arr.push({
							xstep:len/2,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: -areaForce['c_point'](len,l,len,0)
						});
					} else if(x_coor<tlen+(len/2)){
						react -= areaForce['c_point'](len,l,x_coor,tlen);
						arr.push({
							xstep:x_coor-tlen,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: -areaForce['c_point'](len,l,x_coor,tlen)
						});
					} else {
						react -= areaForce['c_point'](len,l,0,0); //Problem here //semi solved
						arr.push({
							xstep:len/2,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: -areaForce['c_point'](len,l,0,0)
						});
						react -= areaForce['c_point'](len,l,x_coor,tlen); //problem here //semisolved
						arr.push({
							xstep:x_coor-(tlen+(len/2)),
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: -areaForce['c_point'](len,l,x_coor,tlen)
						});
					} //cload
		        },two_point:function(i,y,l,len,tlen,noX){ // somebugs found.
		        	react += y;
		        	tempShear -= (y - (noX ? areaForce['two_point'](len,l,x_coor,tlen) : areaForce['two_point'](len,l,len,0)));
		        	if(x_coor>tlen+len){
		        		react -= areaForce['two_point'](len,l,0,0);
			        	arr.push({
							xstep:len/3,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: - areaForce['two_point'](len,l,0,0)
						});
						react -= areaForce['two_point'](len,l,len/3,0);
			        	arr.push({
							xstep:len/3,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: -areaForce['two_point'](len,l,len/3,0)
						});
						react -= areaForce['two_point'](len,l,len,0)/2;
			        	arr.push({
							xstep:len/3,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: - areaForce['two_point'](len,l,len,0)
						});
		        	} else if(x_coor<tlen+(len/3)){
						react -= areaForce['two_point'](len,l,x_coor,tlen);
						arr.push({
							xstep: x_coor-tlen,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: - areaForce['two_point'](len,l,x_coor,tlen)
						});
					} else if(x_coor-tlen==len/3){
						react -= areaForce['two_point'](len,l,0,0);
						arr.push({
							xstep: x_coor-tlen,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: - areaForce['two_point'](len,l,0,0)
						});
					}else if (x_coor<tlen+(len*2/3) && x_coor>tlen+(len/3)){
						react -= areaForce['two_point'](len,l,0,0);
						arr.push({
							xstep:len/3,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: - areaForce['two_point'](len,l,0,0)
						});
						react -= areaForce['two_point'](len,l,x_coor,tlen);
						arr.push({
							xstep:x_coor-(tlen+(len/3)),
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: -areaForce['two_point'](len,l,x_coor,tlen)
						});
					} else {
						react -= areaForce['two_point'](len,l,0,0);
						arr.push({
							xstep:len/3,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: - areaForce['two_point'](len,l,0,0)
						});
						react -= areaForce['two_point'](len,l,len/2,0);
						arr.push({
							xstep:len/3,
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF: -areaForce['two_point'](len,l,len/2,0)
						});
						react -= (areaForce['two_point'](len,l,x_coor,tlen)/2);
						arr.push({
							xstep:x_coor-(tlen+(len*2/3)),
							index:i,
							yreact:react,
							shearF: tempShear,
							areaF:-(areaForce['two_point'](len,l,x_coor,tlen)/2)
						});
					}
		        },noload:function(i,y,l,len,tlen,noX){ //correct naman ata
		        		tempShear += y;
						react += y;
						arr.push({
							xstep:(noX ? x_coor-tlen : len),
							index:i,
							yreact: react,
							shear:shear(x_coor),
							shearF:tempShear,
						});
		        } //noload
			} //just helpers

			var react=0;
			var moment=0;
			$(members).each(function(ind,elm){
				if(x_coor>=tlength+elm.eil.lenInMeters){
					// console.log('M1 - iterated ind:',ind,' type:',elm.load.type,tlength,x_coor);
					pushBy[elm.load.type](ind,allReact[ind].y,elm.load.load,elm.eil.lenInMeters,tlength,false);
					tlength+=elm.eil.lenInMeters;
				} else {
					// console.log('M2 - iterated ind:',ind,' type:',elm.load.type,tlength,x_coor);
					pushBy[elm.load.type](ind,allReact[ind].y,elm.load.load,elm.eil.lenInMeters,tlength,true);
					return false;
				}
			});

			return arr;
		}
		
	
		var momentb4 = 0;
		function moment(){
			var dMArr = dividedMembers();
			var total=0;
			var other;
			$(dMArr).each(function(ind,elm){
				// console.log('before moment',total);
				if(elm.index==0){
					total -= allReact[elm.index].r;
				}

				total += (elm.yreact * elm.xstep) - (elm.arm!==undefined ? elm.arm:0);
				// console.log('after moment',total);
			});
			// console.log('steplist',dMArr);
			// console.log('laststep',dMArr[dMArr.length-1]);
			total = parseFloat(total.toFixed(2));
			return total;
		}//returns kN-m

		var xtemp = {
			shear: shear(),
			moment: moment(),
		}
		function deflect(){ //edit
			return ((xtemp.moment * 1000000) / (memTemp.eil.elast * memTemp.eil.iner)) * 1000;
		}
		function bend(){
			var bend = {
				centriod:0,
				height:0,
				top:0,
				bottom:0
			}
			var memTemp = findMember(x_coor);
			if(memTemp.msc.material.shape ==='basic'){
				return bend ={
					centriod:0,
					height:0,
					top:0,
					bottom:0
				}
			} else {
				x = (memTemp.msc.material.shape ==='square' ? memTemp.msc.material.dimensions.Base : (memTemp.msc.material.shape ==='circle' ? memTemp.msc.material.dimensions.Diameter : memTemp.msc.material.dimensions.Height));
				bend.top = (((xtemp.moment * 1000000) * (x - memTemp.msc.centriod)) / memTemp.eil.iner) / 1000;
				bend.bottom = (((xtemp.moment * 1000000) * memTemp.msc.centriod) / memTemp.eil.iner) / 1000;
				bend.centriod = memTemp.msc.centriod;
				bend.height = x;
				return bend;
			}
			//NOTE! convert to N/m2 for consistency
			//N/mm2 * 1000000 = N/m2 = pascal => (1000) = kPa
		}
		var shearLimit = (multipliers.shearstresses!=undefined?multipliers.shearstresses:9);
		function shearStr(){ //add
			var strs = new Array(shearLimit);
			var memTemp = findMember(x_coor);
			var SHAPE = memTemp.msc.material.shape;
			if(SHAPE ==='basic'){
				for (var i = 0; i < strs.length; i++) {
					strs[i] = 0;
				}
				return strs;
			}
			dim = memTemp.msc.material.dimensions;
			getWidth = {
				square:function(x){
					return dim.Base;
				},
				rec:function(x){
					return dim.Base;
				},
				ibeam:function(x){
					if((dim.Height>=x && x>dim.Height-dim.Flange) || (x<dim.Flange) ){
						return dim.Base;
					} else {
						return dim.Web;
					}
				},
				tbeam:function(x){
					if(dim.Height>=x && x>dim.Height-dim.Flange){
						return dim.Base;
					} else {
						return dim.Web;
					}
				},
				circle:function(x){
					var rad = dim.Diameter/2;
					var b = rad-(x <= memTemp.msc.centriod ? x: height - x);
					// console.log(Math.pow(rad,2),Math.pow(b,2),Math.sqrt(Math.pow(rad,2)-Math.pow(b,2)));
					return (Math.sqrt(Math.pow(rad,2)-Math.pow(b,2))*2);
				}
			}
			getArea = { 
				square:function(a,b){ //base * height
					return a*b;
				},
				rec:function(a,b){
					return a*b;
				},
				ibeam:function(a,b){
					var con = b <= dim.Flange;
					return dim.Base * (con ? b : dim.Flange) + (dim.Web * (con? 0 : b-dim.Flange)); //sayop na ni. :((( a is width of y
				},
				tbeam:function(a,b,obj){
					var con = obj.step <= dim.Flange;
					if(obj.step>memTemp.msc.centriod){
						return dim.Web * b;
					}
					return dim.Base * (con ? b : dim.Flange) + (dim.Web * (con?0 : b-dim.Flange));
				},
				circle:function(a,b){ // width * height care
					if(a==0||b==0){
						return 0;
					}
					var type1 = b + (a*a/(4*b));
					return Math.asin(a/type1) * type1;
				}
			}

			var s = xtemp.shear * 1000; //kN -> N
			VoverIB = s / (memTemp.eil.iner*(SHAPE === 'square' ? dim.Base : SHAPE ==='circle' ? dim.Diameter : dim.Height)); // V/I = N/mm5

			var temp = [];
			var height = (SHAPE === 'square' ? dim.Base : SHAPE ==='circle' ? dim.Diameter : dim.Height);
			var step = height/(shearLimit-1); 
			for(var i = 0;i<strs.length;i++){
				var tempH=(step*i <= memTemp.msc.centriod ? step*i : height-step*i), //sakto?
					tempC=tempH/2; //sayop pd ata
				temp.push({
					step: step*i, //top to bottom height!
					height: tempH, //height from top
					cHeight: tempC, //center height
					resultant: memTemp.msc.centriod - tempH + tempC, //sakto?
					width: getWidth[SHAPE](step*i),
					oWidth: (SHAPE ==='circle' ? dim.Diameter : dim.Base),
					centriod: memTemp.msc.centriod,
					aboveCentriod: (step*i <= memTemp.msc.centriod)
					// area: getArea['circle'](getWidth[SHAPE](step*i),tempH)
				});
			}
			console.log(temp, step);

			for (var i = 0; i < strs.length; i++) {
				// strs[i] = getRandomArbitrary(20,40);
				strs[i] = VoverIB * (getArea[SHAPE](temp[strs.length-1 - i].width,temp[strs.length-1 - i].height,temp[strs.length-1 - i]) * temp[strs.length-1 - i].resultant) * 1000000; 
				strs[i] /= 1000; // N/mm2 -> N/m2 = pascal ->kP
			}
			// console.log(strs);
			return strs; //each returns N/m2 units
		}
		return {
			x:x_coor,
			beamtype:memTemp.msc.material.shape,
			shearforce: xtemp.shear
			,shearforceb4: parseFloat(shearb4elm.toFixed(2))
			,momentforce: xtemp.moment
			,momentforceb4: parseFloat(momentb4.toFixed(2))
			,deflection:deflect()
			,bendingStress:bend()
			,shearStress: shearStr()
		}
	}

	this.calcAll = function(showConsole){
		if(showConsole){
			this.connectMJ();
			console.log("coordinatelist:");
			console.log(this.coordinateList());
			console.log("Each Member KMatrix:");
			for (var i = 0; i < members.length; i++) {
				console.log(i,members[i].getKMatrix());
				members[i].getKMatrix();
			};
				// 
			console.log("Each Member Qf:");
			for (var i = 0; i < members.length; i++) {
				console.log(i,members[i].getQfixedEnd());

			};
				

			console.log("P = applied forces:");
			console.log(this.getAppForces());
			
			console.log("Pf (fixedEndMoments):");
			console.log(this.solvePf());

			
			console.log("SumKm:");
			console.log(this.sumKmatrix());

			this.solveDisplacement();


			for (var i = 0; i < members.length; i++) {
				console.log("KU:");
				console.log(i,members[i].getKU(disPerMember[i]));
				console.log("getQ:");
				console.log(i,members[i].getQ(members[i].getQfixedEnd()));

			};
			
			console.log(this.solvePR());
			// this.solvePR();
		} else {
			this.connectMJ();
			this.coordinateList();
			for (var i = 0; i < members.length; i++) {
				members[i].getKMatrix();
			};

			for (var i = 0; i < members.length; i++) {
				members[i].getQfixedEnd();
			};
				
			this.getAppForces()
			
			this.solvePf();
			this.sumKmatrix()
			this.solveDisplacement(); 
			for (var i = 0; i < members.length; i++) {
				members[i].getKU(disPerMember[i]);
				members[i].getQ(members[i].getQfixedEnd());
			};
			
			this.solvePR();
		}
		
	};
} //end of beam

// Beam.prototype = {
// 	constructor: Beam,

// }

function Member(elast,inertia,bLength){
	//input
	var elast = elast; //MPa = N/M^2
	var inertia = inertia;	//in mm^4
	var bLength = bLength; //in mm 
	/*translate to 
		elast => GPa * 1000
		inertia => M^4 * 1000
		bLength => Meters*/
	this.EIoverL = (elast * inertia) / Math.pow(bLength,3); // your calc limit problem possibly solves here.

	//necessary objects
	this.jointA;
	this.load;
	this.jointB;

	//after values
	this.msc; // area, dimensions, shapename,
	this.eil = {
		elast:elast,
		iner:inertia,
		len:bLength,
		lenInMeters: bLength/1000
	}
	
	//requiredsteps

	// Member Stiffness
	var kMatrix = new Array();
	this.getKMatrix = function(){
		if(kMatrix.length === 4 ){
			return kMatrix;
		}

		var l = bLength;
		var temp = [[12, 6*l, -12, 6*l],
			[6*l, 4*Math.pow(l,2), -6*l, 2*Math.pow(l,2)],
			[-12, -6*l, 12, -6*l],
			[6*l, 2*Math.pow(l,2), -6*l, 4*Math.pow(l,2)]];
		var temp1DArray ;
		var temp2DArray = new Array();

		for (var i = 0; i < temp.length; i++) {
			temp1DArray = new Array();
			for (var j = 0; j < temp[i].length; j++) {
				temp1DArray.push(this.EIoverL * temp[i][j]);
			};
			temp2DArray.push(temp1DArray);
		};
		kMatrix = temp2DArray;

		return kMatrix;
	};

	//Member fixedEndMoment === Qf
	var fixedEndArray = new Array();
	this.getQfixedEnd = function(){
		if(fixedEndArray.length === 4/* || fixedEndArray !== undefined*/){
			return fixedEndArray;
		}
		var loadType = this.load.type;
		var loadLoad = this.load.load; // small w == P; we'll use this variable for consistencies 
		var temp = [0,0,0,0]; // in sequence [FS1, FM1, FS2, FM2]
		var l = bLength / 1000;
		switch (loadType) {
			case "noload":
				temp = [0,0,0,0]; 
				break;
			case "c_point":
				//[P/2, PL/8, P/2,PL/8]
				temp = [loadLoad/2, (loadLoad * l)/8, loadLoad/2, (loadLoad * l)/8];
				break;
			case "two_point":
				//[P, 2PL/9, P, 2PL/9]
				temp = [loadLoad, (2*loadLoad*l)/9, loadLoad, (2*loadLoad*l)/9];
				break;
			case "3-point":
				break;
			case "equally":
				//[qL/2, qL^2/12, qL/2, qL^2/12]
				temp = [(loadLoad * l)/2, (loadLoad*l*l)/12, (loadLoad * l)/2, (loadLoad*l*l)/12];
				break;
			case "left_con":
				//[7qL/20, qL^2/20, 3qL/20, qL^2/30] // \
				temp = [(7*loadLoad*l)/20, (loadLoad*l*l)/20, (3*loadLoad*l)/20, (loadLoad*l*l)/30];
				break;
			case "right_con":
				//[3qL/20, qL^2/30, 7qL/20, qL^2/20] // /
				temp = [(3*loadLoad*l)/20, (loadLoad*l*l)/30, (7*loadLoad*l)/20, (loadLoad*l*l)/20];
				break;
			default:
				temp = [0,0,0,0]; 
				// fixedEndArray = temp;
				break;
		}
		//check for force directions.
		// /*
		// 	identify each joint if freecoordinate
		// */
		if(temp !== 0){
			temp[3] = -temp[3]; // 0,1,2,3 //explain.. theoretical vs formula
		}
		//return
		fixedEndArray = temp;
		return fixedEndArray;
	};

	var KU = new Array();
	this.getKU = function(disArray){
		if(KU.length === 4/* || fixedEndArray !== undefined*/){
			return KU;
		}
		var sp = new spMatrices();
		var kMatrix = this.getKMatrix();
		// console.log('KMatrix, displacement:',kMatrix,disArray);
		KU = sp.multiply(kMatrix, disArray);
		for (var i = 0; i < KU.length; i++) {
			KU[i] = KU[i]; //KU[i].toPrecision(6);
			if(i%2 === 0){
				KU[i] = KU[i] / 1000;
			} else {
				KU[i] = KU[i] / 1000000;
			}
		};
		return KU; //this is matrix.. watch out
	};
	//Q(member) = KU + Qf(Member)
	var Qmoments = new Array();
	this.getQ = function(feA){
		if(Qmoments.length === 4/* || fixedEndArray !== undefined*/){
			return Qmoments;
		}
			// console.log("fixedEndArray");
			// console.log(fixedEndArray);
		for (var i = 0; i < KU.length; i++) {
			Qmoments.push(KU[i] + fixedEndArray[i]);
		};

		return Qmoments;
	};

	this.hasFreeCoor = function(){
		return (this.jointA.freeCoordinate() || this.jointB.freeCoordinate());
	};

	//fornextsteps
	this.getLength = function(){ return bLength; };
	this.getLengthInMeters = function(){ return bLength / 1000; };

	//depreciated
	this.getMemberCalc = function(){ // getmembercalc = EIoverL;
		return (this.elast * this.inertia) / Math.pow(this.bLength,3);
	};
}

function Load(type, load){
	unit: "kN/m";
	// var types = ["c-point","2-point","3-point","even-dist","left-sloped","right-sloped", "none"];
	if (!loadastype.includes(type)){
		throw new Error('Load type not on standard category.');
	}
	this.type = type;
	if(type === "none"){
		this.load = 0;
	}

	this.load = load;


	this.getLoad = function(){
		return this.load;
	};
}

//will be used to contain truth and specific values.
// Joint here is Object definition: declares the properties of a joint.
// not necessary contains any methods since most calculations requires more specifics.
function Joint(type) {
	var types = ["pin", "roller", "fix", "none"];
	if (!types.includes(type)){
		throw new Error('Joint type not on standard category.');
	}
	this.type = type;
	//type restrictions; if false, the joint is a free coordinate
	this.vertRestrict = false;
	this.rotateRestrict = false;

	var hasVertForce = false;
	var hasRotForce = false; //has applied forces

	this.jointForces = new Array();

	this.addVertForce = function(force, oDir){
		if (this.vertRestrict){
			throw new Error('Joint is vertically restricted.');
		}
		if (this.hasVertForce){
			throw new Error('Vertical force applied already.');
		}
		var position = "y";
		if(oDir){
			force = -force;
		}
		var temp = new JointForce(position, force, oDir);
		this.hasVertForce = true;
		return this.jointForces.push(temp);
	};

	this.addRotForce = function(force, oDir){
		if (this.rotateRestrict){
			throw new Error('Joint is rotationally restricted.');
		}
		if (this.hasRotForce){
			throw new Error('Rotational force applied already.');
		}
		var position = "r";
		if(oDir){
			force = -force;
		}
		var temp = new JointForce(position, force, oDir);
		this.hasRotForce = true;
		return this.jointForces.push(temp);
	};

	this.initType =function(){
	switch(this.type){
		case "pin":
			this.vertRestrict = true;
			this.rotateRestrict = false;
			break;
		case "roller":
			this.vertRestrict = true;
			this.rotateRestrict = false;
			break;
		case "fix":
			this.vertRestrict = true;
			this.rotateRestrict = true;
			break;
		default:
			this.vertRestrict = false;
			this.rotateRestrict = false;
			break;
		}
	}
	this.freeCoordinate = function(){  //false; default
		return ( this.vertRestrict === false || this.rotateRestrict === false);
	};
}

function JointForce (axialforce, force, oDirection){
	var axialForces = ["y", "r"];
	if (!axialForces.includes(axialforce)){
		throw new Error('Unknown forces.');
	}
	this.axialForce = axialforce; //applied forces
	this.force = force;
	this.oDirection = oDirection; //true if applied force is opposite. ie. true if above platform(y) or clockwise(r)
	var unit;

	//depreciated
	this.getAxialForce = function(){ return this.axialForce;	};
	this.getForce = function(){	return this.force; };
	this.getUnit = function(){ return this.unit; };
}


function spMatrices() {
	var ERROR_MATRIX_NOT_SQUARE = 'Matrix must be square.';

	this.addArray = function(arr1, arr2, index){
		if( index<0 || arr1.length < index){
			throw new Error('not on bounce index');
		}
		var arr = arr1;
		for (var i = 0; i < arr2.length; i++) {
			if(arr[index+i] === undefined){
				arr[index+i] = 0;
			}
			arr[index+i] = arr[index+i] + arr2[i];
		};
		return arr;
	};

	this.multiply = function(matrix, arr){
		if (matrix[0].length !== arr.length) {
		    throw new Error("Not equal dimentions.");
		}
		var value = new Array();
		for (var i = 0; i < matrix.length; i++) {
			var x = 0;
			for (var j = 0; j < matrix[i].length; j++) {
				x = (matrix[i][j] * arr[j]) + x;
			};
			value.push(x);
		};
		return value;
	};

	this.mergeAdd = function(matrix1, matrix2, index){ //index is square index

		if(!this.isSquare(matrix1) || !this.isSquare(matrix2)){
			throw new Error('first matrix is not square');
		} else if( index<0 || matrix1.length < index){
			throw new Error('not on bounce index');
		}
		var matrix = matrix1;
		var length = index + matrix2.length;
		for (var i = 0; i < matrix2.length; i++) {
			for (var j = 0; j < matrix2[i].length; j++) {
				if(matrix[index+i] === undefined){
					matrix[index+i] = new Array();
				}
				if(matrix[index+i][index+j] === undefined){
					matrix[index+i][index+j] = matrix2[i][j];
				} else {
					matrix[index+i][index+j] = matrix[index+i][index+j] + matrix2[i][j];	
				}
			};
		};
		for (var i = 0; i < length; i++) {
			for (var j = 0; j < length; j++) {
				if(matrix[i][j] === undefined)
					matrix[i][j] = 0;
			};
		};

		return matrix;
	};

	//dont change here
  	this.inverse = function(matrix){
  		if (!this.isSquare(matrix)) {
		    throw new Error(ERROR_MATRIX_NOT_SQUARE);
		}

		var n = matrix.length,
		identity = this.identity(n),
		i;
		// AI
		for (i = 0; i < n; i++) {
		    matrix[i] = matrix[i].concat(identity[i]);
		}
		// inv(IA)
		matrix = this.GaussJordanEliminate(matrix);
		// inv(A)
		for (i = 0; i < n; i++) {
		    matrix[i] = matrix[i].slice(n);
		}
		return matrix;
  	};

  	//dont change here
  	this.identity = function(n){ //n = length of matrix
  		var result = new Array(n);
		for (var i = 0; i < n; i++) {
	    	result[i] = new Array(n);
	    	for (var j = 0; j < n; j++) {
	      		result[i][j] = (i === j) ? 1 : 0;
	    	}
	  	}
  		return result; //
  	};

  	//dont change here
  	this.isSquare = function(matrix){
  		// console.log(matrix);
  		if (!Array.isArray(matrix)) {
		    throw new Error('Input must be a matrix.');
		} else if (matrix[0][0] === undefined) {
		    throw new Error('Input cannot be a vector.');
		}

		var rows = matrix.length;
		for (var i = 0; i < rows; i++) {
		    if (matrix[i].length !== rows) return false;
		}
		return true;
  	};

  	//dont change here
	this.GaussJordanEliminate = function (m, epsilon) {
	  // Translated from:
	  // http://elonen.iki.fi/code/misc-notes/python-gaussj/index.html
	  var eps = (typeof epsilon === 'undefined') ? 1e-10 : epsilon;

	  var h = m.length;
	  var w = m[0].length;
	  var y = -1;
	  var y2, x, c;

	  while (++y < h) {
	    // Pivot.
	    var maxrow = y;
	    y2 = y;
	    while (++y2 < h) {
	      if (Math.abs(m[y2][y]) > Math.abs(m[maxrow][y]))
	        maxrow = y2;
	    }
	    var tmp = m[y];
	    m[y] = m[maxrow];
	    m[maxrow] = tmp;

	    // Singular
	    if (Math.abs(m[y][y]) <= eps) {
	      return m;
	    }

	    // Eliminate column
	    y2 = y;
	    while (++y2 < h) {
	      c = m[y2][y] / m[y][y];
	      x = y - 1;
	      while (++x < w) {
	        m[y2][x] -= m[y][x] * c;
	      }
	    }
	  }

	  // Backsubstitute.
	  y = h;
	  while (--y >= 0) {
	    c = m[y][y];
	    y2 = -1;
	    while (++y2 < y) {
	      x = w;
	      while (--x >= y) {
	        m[y2][x] -= m[y][x] * m[y2][y] / c;
	      }
	    }
	    m[y][y] /= c;

	    // Normalize row
	    x = h - 1;
	    while (++x < w) {
	      m[y][x] /= c;
	    }
	  }

	  return m;
	};

}

Joint.prototype = {
	//for specifics
	constructor: Joint
};

var ShearBend = (function(){

	/*
		ShearForce Step
	*/
	// l = length of member, ld = load of member, x = position on beam, x2 = total length of previous members;
	var areaForce = { 
		equally:function(l,ld,x,x2){
			return ld*(x-x2);
		},left_con:function(l,ld,x,x2){
			var area = (ld + (ld * ((x2+l - x)/l) ))/2;
			return area;
		},right_con:function(l,ld,x,x2){
			var area = (ld * (x-x2))/l;
			return ld*(x-x2);
		},c_point:function(l,ld,x,x2){ //sayop?
			var mid = l/2;
			if ((x-x2) >= mid) return ld;
			return 0;
		},two_point:function(l,ld,x,x2){
			var _x = (x-x2);
			var point = l/3;
			if (_x >= point && _x < point*2) return ld;
			else if (_x >= point*2) return ld+ld;
			return 0;
		},noload:function(l,ld,x,x2){
			return 0;
		}
	}

	var getShearforce = function(x){
		var allData = sample;
		var total=0,
			tLength = 0;
		$(allData.reactions).each(function(ind,obj){
			// console.log(total);
			if(tLength>x) {
				return total;
			} 
			total += obj.y;
			// console.log(total);
			if(allData.memb[ind] !== undefined){
				var c = allData.memb[ind];
				if (c.ltype !== 'noload'){ 
					if (x>c.len+tLength) 
						total -= areaForce[c.ltype](c.len,c.load,c.len,0);
					else 
						total -= areaForce[c.ltype](c.len,c.load,x,tLength);
				}
				// console.log(c.ltype);
				tLength += c.len;
			}
		});
		return total; //kN
	}

	/*
		MomentForce Step
	*/
	var momentForce = { 
		equally:function(l,ld,x,x2){ // kani lang ata sakto.
			var mid = (x-x2)/2;
			return ld*(x-x2) * mid;
		},left_con:function(l,ld,x,x2){
			var area = (ld + (ld * ((x2+l - x)/l) ))/2;
			return area;
		},right_con:function(l,ld,x,x2){
			var area = (ld * (x-x2))/l;
			return ld*(x-x2);
		},c_point:function(l,ld,x,x2){ //sayop?
			var mid = l/2;
			if ((x-x2) >= mid) return ld;
			return 0;
		},two_point:function(l,ld,x,x2){
			var _x = (x-x2);
			var point = l/3;
			if (_x >= point && _x < point*2) return ld;
			else if (_x >= point*2) return ld+ld;
			return 0;
		},noload:function(l,ld,x,x2){
			return 0;
		}
	}
	var getMomentForce = function(x){
				var allData = sample;
		var momentF=0;
			tLength = 0;
		$(allData.reactions).each(function(ind, obj){
			if(tLength>x) {
				return momentF;
			} 
			if(ind===0){
				momentF -= obj.r;
				// console.log('initiate position y');
				// console.log(momentF,'at line 60 with', ind);
			}
				
			if(allData.memb[ind] !== undefined ){
				var c = allData.memb[ind],
					force,
					arm;
				momentF -= (-obj.y * (x-tLength));
				// console.log('apply reacting forces*distance');
				// console.log(momentF,'at line 66 with', ind);
				if(c.ltype !== 'noload'){
					// console.log('apply loadforces*distance');
					if(x>=c.len + tLength){
						force = areaForce[c.ltype](c.len,c.load,c.len,0),
						arm = momentArm[c.ltype](c.len,c.load,x,tLength);
						momentF -= (force * arm); 
						// console.log(momentF,'at line 77 with ', ind ,' with force ' + force+ ' and arm '+arm);
					} else {
						force = areaForce[c.ltype](c.len,c.load,x,tLength),
						arm = momentArm[c.ltype](c.len,c.load,x,tLength);
						momentF -= (force * arm); 
						// console.log(momentF,'at line 82 with ', ind,' with force ' + force+ ' and arm '+arm);
					}
				}

				tLength += c.len;
			}

			// console.log(momentF,'moment', allData.memb[ind],'memb');
		});
		return momentF; //kN-m
	}

	/*
		Miscellaneous functions
	*/
	function findMemberOn(x){
		var l=0,ob;
		$(sample.memb).each(function(ind, obj){
			if(x>=l && x<l+obj.len) {
				ob = obj;
			}
			l+= obj.len;
		});
		return ob;
	}

	function getTotalLength(){ // return full length of beam
		var total = 0;
		$(sample.memb).each(function(ind,obj){
			total += obj.len;
		});
		return total;
	}

	return {
		config:function(){
			
		},shearForceOn:function(x){
			return getShearforce(x);
		},momentForceOn:function(x){
			return getMomentForce(x);
		},deflectForceOn:function(x){
			var mem = findMemberOn(x);
			return getMomentForce(x) / (mem.shape.elast * mem.shape.inertia);
		},shearStress: function(){ //sayop.
			var maxShear = {
				ind:0,
				val:0
			}, length=getTotalLength();

			//V=maximum~getShearForce(x);
			for(i=0;i<=length;i++){
				var sf = Math.abs(getShearforce(i));
				if (sf > maxShear.val) {
					maxShear={
						ind:i,
						val:sf //maximum shear force
					}
				};
			}
			var memObj = findMemberOn(maxShear.ind); //to verify. uses inertia & shape:dimensions.
			var VoverIB;
			if (memObj.shape.name==='basic'){
				VoverIB = (
					(maxShear.val * 1000) //kN to N
					/ (memObj.shape.inertia // second moment of inertia.. use table output inertia.
						* Math.sqrt(memObj.shape.area))); /* inertia: mm4; base mm*/
			} else {
				VoverIB = (
					(maxShear.val * 1000) //kN to N
					/ (memObj.shape.inertia // second moment of inertia.. use table output inertia.
						* memObj.shape.dimensions['Base'])); /* inertia: mm4; base mm*/
			}

			var StressArray = new Array();

			$(constantSample.QDist).each(function(ind, val){ // modify for bette coding: preset
				var t;
				if (memObj.shape.name==='basic'){
					var sq = Math.sqrt(memObj.shape.area);
					// console.log(sq,'sq');
					t = VoverIB 
					* (sq 	// Q starts here// modify/add a local function that control this in special cases.
						* val 						// only change this parts.
						* ((val/2) 
							+ ((sq/2) - val)));
				} else {
					t = VoverIB 
					* (memObj.shape.dimensions['Base'] 	// Q starts here// modify/add a local function that control this in special cases.
						* val 						// only change this parts.
						* ((val/2) 
							+ ((memObj.shape.dimensions['Height']/2) - val)));
				}
				// console.log(t);
				StressArray.push(t*1000000); // N/mm2 -> N/m2 = pascal
			});

			// something here.. look at untitled ***
			//single var inputs: inertia; Q = first moment inertia; 
			//array var inputs: B width of intersections.
			return StressArray;
		}
		,bendingStress: function(x){
			//returns two values
			var bend = {
				top:0,
				bottom:0
			}
			var mem = findMemberOn(x);
			//do it here

			bend.top = ((getMomentForce(x) * 1000000) * (mem.shape.dimensions.Height - mem.shape.centriod)) / mem.shape.inertia;
			bend.bottom = ((getMomentForce(x) * 1000000) * mem.shape.centriod) / mem.shape.inertia;

			return bend; //returns N/mm2
		}
	}
});


/*
This should calculate as Main part of program
	longitudinal: graph
		Shear Force = done
		Moment Force = done
			kNm
		Deflection (Optional)
			{
				M / E * I
				M = moment force on x
				E = elasticity
				I = inertia
			}
	crosssectional: 2D
		Shear Stress
		Bending Stress
			Displays two stresses..
			{
				(M * y) / I
					M = moment force on x
					y = from top to neutral axis ; c = from bottom to neutral axis
					I = inertia
			}
*/
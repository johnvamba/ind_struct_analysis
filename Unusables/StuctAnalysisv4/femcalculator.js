

function Beam() {
	//instantiations
	//Array of Members
	var sp = new spMatrices();
	var members = new Array(); //cannot be called

	this.addMember = function(e,i,l){ //elasticity, inertia, length //doesn't apply load
		//add 2 joints with a load if empty members
		//adds 1 joint with a load if has members
		var x = new Member(e,i,l); //instantiate member;

		if(members.length <= 0){
			this.addJoint(); //add type "none" joint
			this.addJoint(); //add type "none" joint
			if(x.jointA === undefined){
				x.jointA = joints[0];
			}
			if( x.jointB === undefined){
				x.jointB = joints[1];
			}
		} else {
			var end = joints.length - 1;
			if(x.jointA === undefined){
				x.jointA = joints[end];
			} 
			if( x.jointB === undefined){
				this.addJoint();
				x.jointB = joints[end+1];
			}
		}

		members.push(x); //adds to the array
		// console.log(members);
	};

	this.getMembers = function(){
		return members;
	}
	// console.log(members); //doesnot display
	//Array of Joints, prob get #of freecoordinates
	var joints = new Array();	//cannot be called
	this.addJoint = function(){
		var x = new Joint("none");
		joints.push(x);
	};

	this.getJoints = function(){
		return joints;
	}

	this.changeJoint = function(index, type){ //0->n , type
		//change a joint from the array
		// console.log(index,type);
		joints[index].type = type;
		switch(type){
		case "pin":
			joints[index].vertRestrict = true;
			joints[index].rotateRestrict = false;
			break;
		case "roller":
			joints[index].vertRestrict = true;
			joints[index].rotateRestrict = false;
			break;
		case "fix":
			joints[index].vertRestrict = true, joints[index].rotateRestrict = true;
			break;
		default:
			joints[index].vertRestrict = false;
			joints[index].rotateRestrict = false;
			// console.log("none");
			break;
		}
		this.connectMJ();
		// console.log(joints[index]);
	};

	this.applyForcetoJoint = function(index, force, coor, counter){
		switch(coor){
			case "y":
			joints[index].addVertForce(force, counter);
			break;
			case "r":
			joints[index].addRotForce(force, counter);
			break;
			default:
			break;
		}
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
	this.addLoad = function(index, load, type){ //add load to a member
		var x = new Load(type, load);
		loads.push(x);
		members[index].load = x;
	};

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
		};
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
	var P = new Array();
	var R = new Array(); //R = Qsum on reactions nonfreecoordinates
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
				if(coor[ind + j][2]){ // check something
					if(temp[ind + j] === undefined){
					}
						temp[ind + j] = tempQ[j];
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
			if(coor[i][2]){
				P.push(temp[i]);
			} else {
				R.push(temp[i]);
			}
		};
		allQ = temp;
		return allQ;
	};

	this.getR = function(){
		if(allQ.length === coor.length)
			return R;
	}

	this.getP = function(){
		if(allQ.length === coor.length)
			return P;
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

	this.calcAll = function(){
		this.connectMJ();
		// console.log("coordinatelist:");
		// console.log(this.coordinateList());
		this.coordinateList();
		// // console.log("Each Member KMatrix:");
		for (var i = 0; i < members.length; i++) {
			// console.log(members[i].getKMatrix());
			members[i].getKMatrix();
		};
			
		// console.log("Each Member Qf:");
		for (var i = 0; i < members.length; i++) {
			// console.log(members[i].getQfixedEnd());
			members[i].getQfixedEnd();
		};
			

		// console.log("P = applied forces:");
		// console.log(this.getAppForces());
		this.getAppForces()
		
		// console.log("Pf (fixedEndMoments):");
		// console.log(this.solvePf().toString());
		this.solvePf();
		
		// console.log("SumKm:");
		// console.log(this.sumKmatrix());
		this.sumKmatrix()
		this.solveDisplacement(); // problem
		// console.log("dispalcements:");
		// console.log(disPerMember);

		for (var i = 0; i < members.length; i++) {
			// console.log("KU:");
			// console.log(members[i].getKU(disPerMember[i]));
			// console.log("getQ:");
			// console.log(members[i].getQ(members[i].getQfixedEnd()));
			members[i].getKU(disPerMember[i]);
			members[i].getQ(members[i].getQfixedEnd());
		};
		
		// console.log(this.solvePR());
		this.solvePR();
	};
} //end of beam

// Beam.prototype = {
// 	constructor: Beam,

// }

function Member(elast,inertia,bLength){
	//input
	var elast = elast; //MPa
	var inertia = inertia;	//in mm^4
	var bLength = bLength; //in mm
	this.EIoverL = (elast * inertia) / Math.pow(bLength,3);

	//necessary objects
	this.jointA;
	this.load;
	this.jointB;

	//after values
	
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
		KU = sp.multiply(kMatrix, disArray);
		for (var i = 0; i < KU.length; i++) {
			KU[i] = KU[i].toPrecision(6);
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
			console.log("fixedEndArray");
			console.log(fixedEndArray);
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

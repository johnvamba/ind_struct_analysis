
var Beam = function(){
	var truthVals = {
		emptyObs:false,
		connected:false,
		applied:false,
		Pf:false,
		kMat:false,
		displace:false,
		reactions:false,
		calcAll:false
	}


	return {
		setObjs: function(){

		}
		,getCoorList: function(){

		}
		,connect: function(){ //connects members, joints and loads

		}
		,getAppForces: function(){

		}
		,solvePf: function(){

		}
		,sumKmatrix: function(){

		}
		,solveDisplacement: function(){

		}
		,solvePR: function(){

		}
		,calculateThis:function(){
			
		},stresses: function(x){
		return {
			shearforceOn:function(){
				return 'some'
			},momentforceOn:function(){
				return 'sumthing';
			},deflectionOn:function(){
				return 'sumthing';
			},bendingStress:function(){

			},shearStress:function(){
				
			}
		}
	}
	}
}

var Member = function(){
	return {
		getKMatrix:function(){

		}
		,getQFixedEnd:function(){

		}
		,getKU:function(){

		}
		,getQ:function(){

		}
		,hasFreeCoor:function(){

		}
	}
}

var Joint = function(){
	return {
		freeCoordinate: function(){

		}
	}
}

var Load = function(){

}


// var calcStep = {
// 	beam: {
// 		connect:false,
// 		getAppForces:false,
// 		solvePf:false,
// 		sumKmatrix:false,
// 		solveDisplacement:false,
// 		solvePR: false,
// 		calculateThis: false
// 	}
// }
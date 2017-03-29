$(document).ready(function(){
// var sample = new Beam();
// sample.addMember(200000, 20000000, 3000);
// sample.addMember(200000, 20000000, 4000);
// sample.changeJoint(0, "fix");
// sample.changeJoint(1, "roller");
// sample.changeJoint(2, "fix");
// sample.addLoad(0, 40, "equally");
// sample.addLoad(1, 0, "noload");
// sample.calcAll();
// // var samplejoint = new Joint("none");
// //console.log(sample.coordinateList());
// console.log(sample.coordinateList());
// // console.log(sample.getCoor());
// // console.log(sample.getJoints());
	console.log(methShear['c_point']());
	console.log(methShear['equally']());
	console.log(methShear['two_point']());

});

	var methShear = {
		c_point: function(){
			return 'c-point called';
		},two_point:function(){
			return 'two-point called';
		},equally:function(){
			return 'equally called';
		}
	}
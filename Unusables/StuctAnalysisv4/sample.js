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
	// console.log(methShear['c_point']());
	// console.log(methShear['equally']());
	// console.log(methShear['two_point']());
	console.log(new ShearBend().setIntPoints());
var svg = Snap('#illuIDSVG');
	var s = 6;
	console.log(getShearforce(s));
	console.log(getMomentForce(s));
	console.log(shapeWidthOnY(s)['square']());
	console.log(ShearStress());
	console.log(findMemberOn(5));

	svg.path('M0 500 C 0 250 250 0 500 0').attr({
			stroke:'green',
			fill:'green',
			strokeWidth:2,
			'fill-opacity':0.2
		});
});

	// var methShear = {
	// 	c_point: function(){
	// 		return 'c-point called';
	// 	},two_point:function(){
	// 		return 'two-point called';
	// 	},equally:function(){
	// 		return 'equally called';
	// 	}
	// }

	var areaForce = { // l = length of member, ld = load of member, x = position on beam, x2 = total length of previous members;
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
		// return ShearForce(x,0);
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
					if (x>c.len+tLength) total -= areaForce[c.ltype](c.len,c.load,c.len,0);
					else total -= areaForce[c.ltype](c.len,c.load,x,tLength);
				}
				// console.log(c.ltype);
				tLength += c.len;
			}
		});
		return total;
	}

	var momentForce = { // l = length of member, ld = load of member, x = position on beam, x2 = total length of previous members;
		equally:function(l,ld,x,x2){
			var mid = (x-x2)/2;
			return ld*(x-x2) *mid;
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
			momentF -= (obj.y * (x-tLength));

			if(allData.memb[ind] !== undefined ){
				var c = allData.memb[ind];

				if (c.ltype !== 'noload' ){ 
					if (x>c.len+tLength) momentF -= momentForce[c.ltype](c.len,c.load,c.len,0);
					else momentF -= momentForce[c.ltype](c.len,c.load,x,tLength);
				}

				tLength += c.len;
			}
			console.log(momentF);
		});
		return momentF;
	}

	function getTotalLength(){
		var total = 0;
		$(sample.memb).each(function(ind,obj){
			total += obj.len;
		});
		return total;
	}

	var ShearStress = function(){
		var maxShear = {
			ind:0,
			val:0
		}, length=getTotalLength();

		for(i=0;i<=length;i++){
			var sf = Math.abs(getShearforce(i));
			if (sf > maxShear.val) {
				maxShear={
					ind:i,
					val:sf
				}
			};
		}
		//V=maximum~getShearForce(x);
		var memObj = findMemberOn(maxShear.ind);
		return maxShear; //maximum

		//single var inputs: inertia; Q = first moment inertia; 
		//array var inputs: B width of intersections.
	}

	function findMemberOn(x){
		var l=0;
		var ob;
		$(sample.memb).each(function(ind, obj){
			// console.log(obj);
			if(x>=l && x<l+obj.len) {
				ob = obj;
			}
			l+= obj.len;
			// console.log(l,obj.len,ob);
		});
		return ob;
	}

	function shapeWidthOnY (y){
		return {
			square:function(){
			return "square";
			},
			rec: function(){

			return "rec";
			},
			ibeam: function(){
			return "ibeam";
			},
			tbeam: function(){
			return "asd";
			},
			circle: function(){
			return "weq";
			},
			basic:function(){
			return "dew";
			},
		}
	}

	var getBendStress = function(x){
		var maxMoment = {
			ind:0,
			val:0
		}, length=getTotalLength(),
		memObj;

		for(i=0;i<=length;i++){
			var sf = Math.abs(getMomentForce(i));
			if (sf > maxMoment.val) {
				maxMoment={
					ind:i,
					val:sf
				}
			};
		}
		memObj = findMemberOn(x);

		var m =
			maxMoment/memObj.calc.centriod * memObj.calc.inertia; //technically correct
		return m; 
		/*
			(Highest Moment / centriod on memberX) * inersia of memberX;
		*/
	}


	/*
		function bending(){
			getMoment('max')
		}
	*/ 
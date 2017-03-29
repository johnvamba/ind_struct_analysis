var ShearBend = (function(){
	var c ={y:null,addX:null}

	function setPoints(){ //feel nako way gamit.. depreciate later
		var allData = sample;
		var _pointI = new Array();
		var fullLength=0;
		$(allData.reactions).each(function(ind, obj){
			//push reaction pointInt
			c = { y: obj.y,	addX:fullLength }
			_pointI.push(c);
			//push member load pointInt
			if(allData.memb[ind] !== undefined){
				var t = allData.memb[ind];
				if(t.ltype ==='c_point'){
					var l = 0;
					while(l<t.len){
						l+=t.len/2; //splits two
						fullLength+=l;
						_pointI.push({
							y:t.load,
							addX:fullLength
						});
					}
				} else if(t.ltype === 'two_point'){
					var l = 0;
					while(l<t.len){
						l+=t.len/3; //splits three
						fullLength+=l;
						_pointI.push({
							y:t.load,
							addX:fullLength
						});
					}
				} else {
					fullLength+=t.len;
					_pointI.push({y:t.load, addX:fullLength});
				}
				// _pointI.push(c);
			}
		});
		fLength = fullLength;
		pointInt = _pointI;
		return pointInt;
	}

	function shearForce(x){ // V()
		// if(x > totalL || x<0) throw new Error('Out of Bounce in Beam');
		// return sumForces(x) - areaForce(x);
		var sum=0;
		$(pointInt).each(function(int,obj){

		});
	}

	// function sumForces(_x){

	// }

	var areaForce = {
		equally:function(){

		}, left_con:function(){

		}, right_con: function(){

		}
	}

	return {
		getShear:function(){
			// var shearArray = new Array();
			// var _length;
			// $(sample.memb).each(function(ind, obj){
				
			// });
		},getBend: function(){

		},setIntPoints:function(){// sayop?
			return setPoints();
		}
	}
});
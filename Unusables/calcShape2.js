var calcShape = function(dimensions){ //array of inputs
	//all var must be BigNum!
	var _dim = new Array(),
		PI = new BigNumber(Math.PI);

	// private functions
	function instantBN(){
		$(dimensions).each(function(){
			_dim.push(new BigNumber(val));
		});
	}

	var areaF = {
		/*area for single dimension
			e.i square*/
		areaS:function(a){ //a is BigNumber.
			return +a.pow(2);
		}
		/*area for circle*/
		,areaC:function(d){
			return +d.pow(2).mul(PI.div(4));
		}
		/*area for double dimension
			e.i square*/
		,area2:function(a,b){
			return +a.mul(b);
		}

		,areaI:function(a,b,c,d){
				/* (a * d * 2) + (b-(2*d)) */ ////Cheeeck?!
			return +(a.mul(d).mul(2)).add(b.sub(d.mul(2)));
		}

		,areaT:function(a,b,c,d){
			return +(a.mul(d) + (b.sub(d)).mul(c));
		}
	}

	var centF = {
		cent: function(a){
			return +a.div(2);
		}
		,centT: function(a,b,c,d){ //a = base, b = height, c = flange d=web
			var x = b.sub(c);
			var y = a.mul(c);
			var part1 = (d.mul((x.pow(2)).div(2)).add((b.mul(2).sub(c).div(2)).mul(y))).div(y.add(x.mul(d)))

			return +part1; // add (+) to variable
		}
	}

	var inerF = {
		iner:function(a){
			return +a.pow(4).div(12);
		}
		,inerA:function(a,b){
			return +a.mul(b.pow(3)).div(12);
		}
		,inerB:function(a,b){
			return +b.mul(a.pow(3)).div(12);
		}
		,inerC: function(a){
			return +a.pow(4).mul(PI).div(64);
		}
		,inerT:function(a,b,c,d){
			var y = new BigNumber(centF.centT(a,b,c,d));
			var e = b.sub(c),
				f = a.mul(c),
				g = e.add(c.div(2)).sub(y);

			var ret = (e.mul(d).mul((y.sub(e.div(2)).pow(2)))).add(d.mul(e.pow(3)).div(12)).add(f.mul(g.pow(2))).add(a.mul(c.pow(3)).div(12));
			return +ret;
		}
	}
	
	return {
		square: {
			area:0,
			inertia:0,
			centriod: 0
		},
		rec: {
			area: 0,
			inertia: 0,
			centriod: 0
		},
		ibeam: {
			area:0,
			inertia: 0,
			centriod: 0
		},
		tbeam: {
			area: 0,
			inertia: 0,
			centriod: 0
		},
		circle:{
			area: 0,
			inertia: 0,
			centriod: 0
		},
		basic:{
			area: 0,
			inertia: 0,
			centriod: 0
		}
	} 
}
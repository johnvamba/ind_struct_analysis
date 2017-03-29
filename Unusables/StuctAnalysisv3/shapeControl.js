var MemberShape = (function(){
	var _Shape, area, inertia, centriod, thisCalculated = false;
	var $modal = $('.memberForm');
	var dimension = {
		Base: null,
		Height: null,
		Web: null,
		Flange: null,
		Diameter: null
	}

	function calculate(){
		var _b,_h;
		$(dimensions[_Shape]).each(function(form, name){
			dimension[name] = getFieldVal(name);
		});

		if(_Shape ==='ibeam'||_Shape === 'tbeam'){
			_b = dimension['Base'] - dimension['Web'];
			_h = dimension['Height'] - (2*dimension['Flange']);
		}

		switch(_Shape){
			case 'square':
				area = calcArea(dimension['Base']);
				inertia = iner(dimension['Base']);
				centriod = cent(dimension['Base']);
			break;
			case 'rec':
				area = calcArea2(dimension['Base'],dimension['Height']);
				inertia = _inerA(dimension['Base'],dimension['Height']);
				centriod = cent(dimension['Base']);
			break;
			case 'ibeam':
				area = calcAreaI(dimension['Base'],dimension['Height'],dimension['Web'],dimension['Flange']);
				inertia = _inerA(dimension['Base'],dimension['Height']) - _inerA(_b,_h);
				centriod = cent(dimension['Base']);
			break;
			case 'tbeam':
				area = calcAreaI(dimension['Base'],dimension['Height'],dimension['Web'],dimension['Flange']);
				inertia = inerT(dimension['Base'],dimension['Height'],dimension['Web'],dimension['Flange']);
				centriod = centT(dimension['Base'],dimension['Height'],dimension['Web'],dimension['Flange']);
			break;
			case 'circle':
				area = calcAreaC(dimension['Diameter']);
				inertia = iner(dimension['Diameter']);
				centriod = cent(dimension['Diameter']);
			break;
		}
		thisCalculated = true;
	}
	function displayThis(){
		$('.dimdata').show();			
		if(completeFields() && thisCalculated){
			// console.log(completeFields());
			$('.dimdata').html('Area = <span>' +area.toFixed(2)+'</span>, Inertia = <span>' +inertia.toFixed(2)+'</span>, Centriod: <span>' +centriod.toFixed(2)+'</span>.');
		} else if(_Shape===undefined) {
			$('.dimdata').text('Select a Member first');
			// thisCalculated = false;
		} else {
			$('.dimdata').text('Some dimension is empty.');
			// thisCalculated = false;
		}
		//$('.dimdata').hide();
	}

	function completeFields(){
		if(_Shape === undefined) return false;
		$(dimensions[_Shape]).each(function(form, name){
			// console.log(getFieldVal(name) !== '');
			if (getFieldVal(name)==='')
			return false;
		});
		return true
	}

	function getFieldVal(fieldID){
		return $('.CRmember').form('get field', fieldID).val();
	}

	return {
		config:function(shape){
			_Shape = shape;
			thisCalculated = false;
			return this;
		},
		isconfigured:function(){
			return _Shape !== undefined;
		},
		calc:function(){
			if(completeFields()) calculate();
			else displayThis();
			return thisCalculated;
		},
		display:function(){
			displayThis();
			return this;
		},
		getCalcValues: function(){
			return {
				area,
				inertia,
				centriod
			}
		},
		getDimValues:function(){
			return dimension;
		}
	}
});
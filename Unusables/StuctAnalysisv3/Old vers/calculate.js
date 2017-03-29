var BeamInfo = (function(){
	var form,formval, area, inersia, centriod;
	var dimensions = {
		square: ['Base'],
		rec: ['Base','Height'],
		ibeam: ['Base','Height','Web','Flange'],
		tbeam: ['Base','Height','Web','Flange'],
		circle: ['Diameter']
	};

	var dimension = {
		base: null,
		height: null,
		web: null,
		flange: null,
		diameter: null
	}

	function calculate(){
		// console.log(getFieldVal('base'));
		$.each(dimensions[formval], function(form, name){
			dimension[name] = getFieldVal(name);
		});

		switch(formval){
			case 'square':
				area = calcArea(dimension['base']);
				inersia = iner(dimension['base']);
				centriod = cent(dimension['base']);
			break;
			case 'rec':
				area = calcArea(dimension['base'],dimension['height']);
				inersia = iner(dimension['base'],dimension['height']);
				centriod = cent(dimension['base'],dimension['height']);
			break;
			case 'ibeam':
				area = calcArea(dimension['base'],dimension['height'],dimension['web'],dimension['flange']);
				inersia = iner(dimension['base'],dimension['height'],dimension['web'],dimension['flange']);
				centriod = cent(dimension['base'],dimension['height'],dimension['web'],dimension['flange']);
			break;
			case 'tbeam':
				area = calcArea(dimension['base'],dimension['height'],dimension['web'],dimension['flange']);
				inersia = iner(dimension['base'],dimension['height'],dimension['web'],dimension['flange']);
				centriod = cent(dimension['base'],dimension['height'],dimension['web'],dimension['flange']);
			break;
			case 'circle':
				area = calcArea(dimension['diameter']);
				inersia = iner(dimension['diameter']);
				centriod = cent(dimension['diameter']);
			break;
		}
		console.log(area,inersia,centriod);
	}

	function displayDim(){
		var disp = '<p>';
		$.each(dimensions[formval], function(form, name){
			disp += name + ': ' + dimension[name] + '<br>';
		});
		disp += '</p>';
		$('#dimensions').html(disp);
	}

	function getFieldVal(fieldID){
		return form.form('get field', fieldID).val();
	}

	function display(){
		$('#area').text('Area = ' + area.toFixed(2));
		$('#inersia').text('Iy = '+ inersia.toFixed(2));
		$('#centriod').text('Cy = ' + centriod.toFixed(2));
	}

	return {
		config:function(formvalue){
			formval = formvalue
			form = $('#'+formvalue);
			return this;
		},
		getValues:function(){
			calculate();
			return this;
		},
		getDisplay: function(){
			display();
			displayDim();
			return this;
		}
	}
});


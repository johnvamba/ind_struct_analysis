var beamTable = (function(){
	var _table = $('#memTable'), 
			_default = 'Empty List of Members.'
		//Button list;
	illu = $('#illustration'),
	calc = $('#calcubutton'),
	react = $('.ui.calculate.button')
		;
	
	function buildMemberRow (dataSet) {
		var htmlrow = '';

		if(tablefield && tablefield.length > 0) {
			//traverse the tablefield, meaning from start to finish index
			$(tablefield).each( function(index, name) {
				var c = dataSet[name+''];
				var _c;

				switch(name){
					case 'memberid':
						_c = '<i class="edit link member id' //<i class="close grey icon"></i>
							+c+' icon"></i><a class="selectable msc">Member'
							+c+'</a>';
					break;
					case 'startjoint':
						c = getInfo(name,c);
						_c = '<h5 class="ui header"><img class="ui rounded image" src='
							+c.photo+ '><div class="content">'
							+c.fullname+ '<div class="sub header">Applied Force: ';
							if(c.force_y!==''){
								_c = _c + '<br>Y: <span>'+c.force_y+'</span> KN';
							}
							if(c.force_r!==''){
								_c = _c + '<br>R: <span>'+c.force_r+'</span> KN-M';
							}
							if(c.force_y==='' && c.force_r===''){
								_c = _c + '<span>None</span>.';
							}
						_c += '</div></div><h5>';
					break;
					case 'endjoint':
						c = getInfo(name,c);
						_c = '<h5 class="ui header"><img class="ui rounded image" src='
							+c.photo+ '><div class="content">'
							+c.fullname+ '<div class="sub header">Applied Force: ';
							if(c.force_y!==''){
								_c = _c + '<br>Y: <span>'+c.force_y+'</span> KN';
							}
							if(c.force_r!==''){
								_c = _c + '<br>R: <span>'+c.force_r+'</span> KN-M';
							}
							if(c.force_y==='' && c.force_r===''){
								_c = _c + '<span>None</span>.';
							}
						_c += '</div></div><h5>';
					break;
					case 'load':
						// _c = c;
						c = getInfo(name,c);
						_c = '<h5 class="ui header"><img class="ui rounded image" src='
							+c.photo+ '><div class="content">'
							+c.fullname+ '<div class="sub header">';
						if(c.force!==''){
								_c = _c + '<span>'+c.force+'</span> KN-M';
						}
						_c += '</div></div><h5>';

					break;
					case 'matTypeLength':
						_c = '<h5 class="ui header"><img class="ui rounded image" src="assets/beamtypes/'
						+c.mattype+'.png"><div class="content">'
						+shapeName[c.mattype]+'<div class="sub header">Length: <span>'
						+c.matlength+'</span> meters<br>Elasticity: <span>'
						+c.matelast+'</span> MPa</div></div></h5>';
					break;
					case 'matDim':
						shape = dataSet['matTypeLength'].mattype;
						_c = '<p>';
						if(shape==='basic'){
							_c+= '<span>'+c.dimensions+'</span>';
						} else {
							$(dimensions[shape]).each(function(index, name){
								_c += name + ': <span>' +c.dimensions[name]+ ' </span>mm<br>';
							});
						}
						_c += '</p>'
					break;
					case 'matCalc':
						_c = '<p>Area: <span>'
						+c.area+'</span> mm<sup>2</sup><br>Inertia: <span>'
						+c.inertia+'</span> mm<sup>4</sup><br>Centriod: <span>'
						+c.centriod+'</span> mm</p>';
					break;
				}

				htmlrow += '<td>' + _c + '</td>';
			});
		}
		return htmlrow;
	}

	function getInfo(name, obj){
		switch(name){
			case 'startjoint':
				return {
					photo: 'assets/jointfaces/' +obj.jointtype+'.png',
					fullname : jointName[obj.jointtype],
					force_y: obj.y_coor,
					force_r: obj.r_coor
				}
			break;
			case 'endjoint':
				return {
					photo: 'assets/jointfaces/' +obj.jointtype+'.png',
					fullname : jointName[obj.jointtype],
					force_y: obj.y_coor,
					force_r: obj.r_coor
				}
			break;
			case 'load':
				return {
					photo: 'assets/loadtypes/' +obj.loadtype+'.png',
					fullname : loadNames[obj.loadtype],
					force: obj.loadvalue,
				}
			break;
			case 'matTypeLength':
				return {
					photo: 'assets/beamtypes/' +obj.mattype+'.png',
					fullname : shapeNames[obj.mattype],
					memlength: obj.memlength,
					matelast: obj.matelast
				}
			break;
		}
	}

	function addBuildToRow(dataSet,row){
		var c = buildMemberRow(dataSet);
		// console.log(row);
		// console.log(': This is row without TR');
		if (row===undefined){
			var rows = _table.children('tbody').children('tr');
			row = '<tr id='+rows.length+'>' + c + '</tr>';
			// row.prop('id', rows.length);
			return row;
		} else {
			row.html(c);
		}
	}

	function hideEditButton(){
		$('.edit.link.member.icon').hide();
	}

	function noItemInfo(){
		// reset other buttons //add later
		if(!illu.hasClass('disabled') && !calc.hasClass('disabled')){
			illu.addClass('disabled');
			calc.addClass('disabled');
		}
		//reset tablebody
		if (_table.length < 1) return; //not configured.
		var content = '<tr class="no-items disabled"><td colspan="7" style="text-align:center">' + 
			_default + '</td></tr>';
		if (_table.children('tbody').length > 0)
			_table.children('tbody').html(content);
		else _table.append('<tbody>' + content + '</tbody>');
	}

	function HasItemsInfo(){
		var c = _table.children('tbody').children('tr');
			if (c.length == 1 && c.hasClass('no-items disabled')) _table.children('tbody').empty();
			//add this later
			if(illu.hasClass('disabled') && calc.hasClass('disabled')){
				illu.removeClass('disabled');
				calc.removeClass('disabled');
			}
	}

	// function translateToHTML(dataSet){
		
	// }

	return {
		addEntry: function(dataSet, append){
			if (_table.length < 1) return; //not configured.
			HasItemsInfo();
			if(dataSet){
				var rows = '';
				rows += addBuildToRow(dataSet);
				var mthd = append ? 'append' : 'html';
				_table.children('tbody')[mthd](rows);
			} else {
				noItemInfo();
			}
			return this;
		},
		init: function(){
			noItemInfo();
			return this;
		},
		disableEdit:function(){
			hideEditButton();
			return this;
		},
		editContent: function(dataSet, row){
			var rows = addBuildToRow(dataSet, row);
		},
		size: function(){
			var c = _table.children('tbody').children('tr');
			if (c.length == 1 && c.hasClass('no-items disabled'))
				return 0;
			return c.length;
		}
	}
});
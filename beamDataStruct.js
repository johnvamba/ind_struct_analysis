var DataStruct = (function(){
	var displaymsc = $('#msc'), 
		mscMatrix = $('#mscTable'),
		displayresult = $('#reaction'),
		resultTable = $('#reactTable');
	var machine = new Beam(),
			ifcalculated= false;
	var FormData = new Array(), //dont touch. for form only
			alldata = new Array(), //modify this from mainCOntrol returnInfo
			jointlist = new Array(), //dummy
			memberlist = new Array(), //dummy
			loadlist = new Array(); //dummy

	function synchronize(){ 
		console.log('synchronizing');
		//divide all data to members and joints
			jointlist = new Array(); //dummy
			memberlist = new Array(); //dummy
			loadlist = new Array(); //dummy
		$(alldata).each(function(index, data){
			if (jointlist.length >= 0 && index === 0){
				jointlist.push(data['startjoint']);
			}
			jointlist.push(data['endjoint']);

			var r = {
				mlength: parseFloat(data['matTypeLength']['matlength']),
				elast: parseFloat(data['matTypeLength']['matelast']),
				inertia: parseFloat(data['matCalc']['inertia']),
				material: data['matDim'],
				area: parseFloat(data['matCalc']['area']),
				centriod: parseFloat(data['matCalc']['centriod']),
			}
			memberlist.push(r);

			loadlist.push(data['load']);
		});
	}

	function initiate(){
		if(jointlist.length - memberlist.length !== 1) throw new Error("Not balanced to connect");
		console.log('integrating to the machine');
		var joints = new Array(),
				members = new Array(),
				loads = new Array();

		$(memberlist).each(function (index, item){
			// console.log(loadlist[index]);
			var member = new Member(item.elast, item.inertia, item.mlength*1000);
			member.msc = {
				material:item.material,
				centriod:item.centriod,
				area: item.area}; //might not work.

			// member.load = load;
			members.push(member);
		});
		// console.log(members);

		$(loadlist).each( function(index, item){
			var load = new Load(item.loadtype, item.loadvalue);
			loads.push(load);
		});
		// console.log(loads);

		$(jointlist).each(function (index, item){
			var type;
			if(item.jointtype === 'startfix' || item.jointtype === 'endfix'){
				type = 'fix';
			} else type = item.jointtype;
			var joint = new Joint(type);
			if(item.y_coor !== ''){ //This is the bug
				joint.addVertForce(item.y_coor,true);
			}
			if(item.r_coor !== ''){
				joint.addRotForce(item.r_coor,false);
			}
			joint.initType();
			joints.push(joint);
		});
		// console.log(joints);

		machine.setMJ(members, joints, loads);
		machine.connectMJ();
	}

	function constructMSC(id){
		displaymsc.find('.title').text('Member '+id+' Miscellaneous Calculation');
		if(!ifcalculated) {
			displaymsc.find('.ui.error.message').show();
			displaymsc.find('.ui.basic.sticky.segment').hide();
			return;
		}
		//get all by id
		var matrix = machine.getMemberCalc('kmatrix', id),
				QFix = machine.getMemberCalc('qf', id),
				// AppForce,
				Qmoment = machine.getMemberCalc('Q', id),
				Displacement = machine.getMemberCalc('displacement',id);

		var fmoment = '';
		displaymsc.find('.ui.error.message').hide();

		var fem = '<p>FSb = <span>'
			+QFix[0].toFixed(2)+'</span><br>FMb = <span>'
			+QFix[1].toFixed(2)+'</span><br>FSe = <span>'
			+QFix[2].toFixed(2)+'</span><br>FMe = <span>'
			+QFix[3].toFixed(2)+'</span>';
		displaymsc.find('.femoment').html(fem); //transfer
		// displaymsc.find('.kmatrix').html(matrix);
		var c;
		$(matrix).each(function(index){
			c+='<tr><td></td>'; //addsomething panghighlight
			$(matrix[index]).each(function(index,value){
				c+='<td class="right aligned">' +value.toFixed(0)+'</td>';
			});
			c+='</tr>'
		});
		mscMatrix.children('tbody').html(c); //transfer

		var dis = '<p>Displacement Sb = <span>'
			+Displacement[0].toFixed(2)+'</span><br>Displacement Mb = <span>'
			+Displacement[1].toFixed(2)+'</span><br>Displacement Se = <span>'
			+Displacement[2].toFixed(2)+'</span><br>Displacement Me = <span>'
			+Displacement[3].toFixed(2)+'</span>';
		displaymsc.find('.displace').html(dis); //transfer

		var Qmom = '<p>QFSb = <span>'
			+Qmoment[0].toFixed(2)+'</span><br>QFMb = <span>'
			+Qmoment[1].toFixed(2)+'</span><br>QFSe = <span>'
			+Qmoment[2].toFixed(2)+'</span><br>QFMe = <span>'
			+Qmoment[3].toFixed(2)+'</span>';
		displaymsc.find('.qmoments').html(Qmom); //transfer
		displaymsc.find('.ui.basic.sticky.segment').show(); //transfer
	}

	function constResultTable(){
		var 
			qend = machine.solvePR(), //by total per coordinate
			// Qmoment = machine.getMemberCalc('Q', id),//per member
			coordinates = machine.coordinateList(); //list

			var c;
			$(jointlist).each(function (index1,obj){
				c+='<tr>';
				c+= '<td><h5 class="ui header"><img class="ui rounded image" src="assets/jointfaces/'
				+obj.jointtype+'.png"><div class="content">'+jointName[obj.jointtype]+'</div></h5></td>';
				$(coordinates).each(function (index2,coorobj){
					if(coorobj[0] === index1){
						c+='<td class="right aligned ';
						c+= coorobj[2] ? 'negative' : '';
						c+= '">'+qend[index2].toFixed(2)+'</td>';
					}
				});
				c+='</tr>';
			});
			displayresult.find('.ui.error.message').hide();
			resultTable.children('tbody').html(c);
	}

	function getTotalLength(){
		var total = 0;
		$(memberlist).each(function(ind,obj){
			total += obj.mlength;
		});
		return total;
	}

	// var tLength=0;
	function findShortLength(){
			if(memberlist.length <= 0){
				throw new Error('Empty Member List');
			}
			var min, thisObj, thisInd;
			$(memberlist).each(function(ind, obj){
				if(obj.mlength < min || ind===0){
					min = obj.mlength;
					thisObj = obj;
					thisInd = ind;
				}
			});
			// min = parseInt(min.toFixed());
			return {
				min,
				thisObj,
				thisInd
			}
		}

	return {
		add: function(dataSet, rawFields){
			FormData.push(rawFields);
			alldata.push(dataSet);
			synchronize();

			toDraw = {
				members : memberlist,
				joints : jointlist,
				loads : loadlist,
				totalLength: getTotalLength()
			}
			thisGlobal.basicDrawOBJ(toDraw);

			multipliers.shortLength = findShortLength().min;

			if(memberlist.length < 3){
				multipliers.spacedistance = 500 / memberlist.length;
			}
			//setup min length
		},
		getFormData: function(id){
			return FormData[id];
		},
		replace: function(dataSet, id){
			rawFormData[id] = dataSet;
		},
		calcAll: function(){
			synchronize();
			initiate();
			machine.calcAll();
			ifcalculated = true;
			constResultTable(); //solvePR executed here
			// toGlobal();
			var msc = machine.msc(); //changes overtime.

			thisGlobal.pathList(
				machine.partition(.05 * multipliers.spacedistance/200)
			); //transfered to paperclass thru thisGlobal.
			// msc = machine.msc();
			ceilings = machine.est;
			console.log(ceilings);

			// thisGlobal.reactList(machine.getReact());

			return machine.solvePR(); //

			/*Return for illustrations
				length each member,
				reactions,
				loads, joints;
			*/
		},
		getMSC: function(id){
			constructMSC(id);
			return this;
		}, 
		ifcalc:function(){
			return ifcalculated;
		},
		getCalcMSC: function(x){
			return machine.stressesOn(x);
			/*
			return {
				shearforce: shear()
				,shearforceb4: parseFloat(shearb4elm.toFixed(2))
				,momentforce: moment()
				,deflection:deflect()
				,bendingStress:bend()
				,shearStress: shearStr()
			}		
			*/
		},
		hasData:function(){ //depreciate this
			return alldata.length > 0 || FormData.length > 0;
		}
	}
});

/*
	Problem:
	1. data stacks on calling synchronize().
	to solve, add truth value all over the place..
*/
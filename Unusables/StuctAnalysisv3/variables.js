var
  memberArray,
  _memberForm,
  _memberTable,

  illu = $('#illustration'),
  illuModal = $('#illumodal'),
  calc = $('#calcubutton'),
  react = $('#react');
		//constants
var	formValid = {
	on:'submit',
	// inline:true,
		fields: {
			beamtype:{
			  identifier: 'beamShape',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a beam type!'
			  }]
			},
			memlength:{
			  identifier: 'memlength',
			  rules:[{
				type:'empty',
				prompt: 'Member has no length!'
			  },
			  {
				type:'number',
				prompt: 'length overbounce, only (atm) 1-100'
			  }]
			},
			loadtype:{
			  identifier: 'loadType',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a Load type!'
			  }]
			},
			elastic:{
			  identifier: 'elastic',
			  rules:[{
				type: 'empty',
				prompt: 'Member has no elasticity!'
			  }]
			},
			jointBtype:{
			  identifier: 'jointBtype',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a Joint type for beginning joint!'
			  }]
			},    
			jointEtype:{
			  identifier: 'jointEtype',
			  rules: [
			  {
				type: 'empty',
				prompt: 'Enter a Joint type for end joint!'
			  }]
			}
		}
	},

	dimensions = {
		square: ['Base'],
		rec: ['Base','Height'],
		ibeam: ['Base','Height','Web','Flange'],
		tbeam: ['Base','Height','Web','Flange'],
		circle: ['Diameter'],
		basic: ['Area','Inertia','Centriod']
	},
	shape = {
		Base: null,
		Height: null,
		Web: null,
		Flange: null,
		Diameter: null
	},
	joint={
		none:['y-coor','r-coor'],
		roller:['r-coor'],
		pin:['r-coor'],
		startfix:[],
		endfix:[]
	},
	jointName = {
		none:'None',
		roller:'Roller',
		pin:'Pin',
		startfix:'Fix',
		endfix:'Fix'
	},
	loadNames = {
		c_point:'Center Concentrated',
		two_point:'2-point Concentrated',
		equally: 'Evenly Distributed',
		left_con: 'Left Distributed',
		right_con: 'Right Distributed',
		noload: 'No Load'
	},
	shapeName={
		square: 'Square',
		rec: 'Rectangular',
		ibeam:'I-Shaped',
		tbeam:'T-Shaped',
		circle:'Cylindrical',
		basic:'Irregular'
	},
	loadastype = ["c_point", "two_point" ,"three_point", "equally", "left_con","right_con", "noload"];
	
	tablefield=['memberid', 'startjoint', 'endjoint', 'load', 'matTypeLength', 'matDim','matCalc'];

	var illuGRequire = [
	'separators', //0
	'bar', //1
	'support', //2
	'load', //3
	'shearLine', //4
	'momentLine', //5
	'textAreas']; //6

// // sample outputs

// 	var sampleoutput;

/*
	Shear Diagram
	Moment Diagram
	Shear Stress
	Bending stress
*/

	/*
		memObj = {
		id, length,
		startsup = {name,[values]}, 
		endsup = {name, [values]}, 
		load = {name, value}}
	*/
/*
	variables
		svg =
		margin = top, bottom, left, right
		center = 50%; //only uses absolute value

		to set
			beamlength
			support types
			
*/

	var attribList = {
		shearD:{
			stroke:'green',
			fill:'green',
			strokeWidth:2,
			'fill-opacity':0.2
		},
		momentD:{
			stroke:'#0054a6',
			fill:'#0054a6',
			strokeWidth:2,
			'fill-opacity':0.2
		},
		shearStress:{

		},
		bendStress:{
			stroke:'#ed1c24',
			fill:'#ed1c24',
			strokeWidth:2,
			'fill-opacity':0.2
		}
	}
	var sample={
		memb:[
				{
					len:4,
					ltype:'noload',
					load:0
				},
				{
					len:4,
					ltype:'equally',
					load:8
				},
				{
					len:5,
					ltype:'c_point',
					load:40
				}
				],
		reactions:[{
					y:58,
					r:0
				},
				{
					y:-30,
					r:0
				},
				{
					y:100,
					r:0
				},
				{
					y:-128,
					r:0
				}],
		xPath:[0,200,400,650]
	}

	var globalData,mul = 50; //data replicated from sample.
	
// lengths:[5,3,5,2],
// 		reactions:
// 		[{
// 			load:'noload',
// 			y:200,
// 			lval:0,
// 			r:100
// 			},{
// 			load:'left_con',
// 			y:10,
// 			lval:10,
// 			r:120
// 			},{
// 			load:'equally',
// 			y:0,
// 			lval:20,
// 			r:-100
// 			},{
// 			load:'equally',
// 			y:50,
// 			lval:20,
// 			r:0
// 			}
// 		]
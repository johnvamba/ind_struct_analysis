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
		none:'Free End',
		roller:'Roller',
		pin:'Pin',
		startfix:'Fix',
		endfix:'Fix'
	},
	loadNames = {
		c_point:'Center Concentrated',
		two_point:'2-point Concentrated',
		equally: 'Rectangular Distributed',
		left_con: 'Left Distributed',
		right_con: 'Right Distributed',
		noload: 'No Load'
	},
	shapeName={
		square: 'Square',
		rec: 'Rectangular',
		ibeam:'I-Shaped',
		tbeam:'T-Shaped',
		circle:'Circular',
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

	//sample
	var sample={
		memb:[
				// {
				// 	len:6,
				// 	ltype:'two_point',
				// 	load:3,
				/*
						calc:{
							inertia:29,
							centriod:,
							area:
						}
				*/
				// },
				{
					len:3,
					ltype:'equally',
					load:6
				},
				{
					len:3,
					ltype:'equally',
					load:6
				},
				{
					len:3,
					ltype:'noload',
					load:0
				}
				],
		reactions:[{
					y:12.64,
					r:8.14
				},
				{
					y:3.43,
					r:2.79
				},
				{
					y:29.93,
					r:-30
				},
				{
					y:-10,
					r:0
				}],
		joints:[
			{
				freeCoor:[],
				type:'fixed'
			},
			{
				freeCoor:['y'],
				type: 'roller'
			},
			{
				freeCoor:['y'],
				type: 'roller'
			},
			{
				freeCoor:['y','r'],
				type: 'none'
			}
		],
		xPath:[0,300,600,900]
	}
	var pointInt; //container for points of interest
	var globalData={
		memb:[],
		reactions:[],
		xPath:[]
	}
	var mul = 50; //data replicated from sample.
	function multiplier(val){
		return val * 50;
	}

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

/* Shear stress and Bending Stress diagram*/

/*
	Shear stress given
		Inertia, <= given from input ////////// member need
		V = maximum Shear force, 
		Q = first moment of inertia, ////////// member need
		B = width of intersection. how? array?
		formula = VQ/IB
		OUTPUT = kN*m^2

	Bending Stress
		Maximum Moment kN/m,
		centriod, mm
		Inertia, mm^4
	OUTPUT = kN*m^2
		formula = MC/Inertia
*/

/*
	c
		b
*/
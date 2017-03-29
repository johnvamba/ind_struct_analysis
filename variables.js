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
	jointastype = ['none', 'roller', 'pin', 'fix']
	
	tablefield=['memberid', 'startjoint', 'endjoint', 'load', 'matTypeLength', 'matDim','matCalc'];

	





/* Shear stress and Bending Stress diagram*/

/*
	Shear stress given
		Inertia, <= given from input ////////// member need		mm3
		V = maximum Shear force,  														kN
		Q = first moment of inertia, ////////// member need		
		B = width of intersection. how? array?								mm
		formula = VQ/IB
		OUTPUT = kN*m^2

	Bending Stress
		Maximum Moment kN*m,
		centriod, mm
		Inertia, mm^4
	OUTPUT = kN*m^2
		formula = MC/Inertia
*/

/*
	c
		b
*/
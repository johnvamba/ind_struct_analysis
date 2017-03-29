square: {
		area:,
		inertia: ,
		centriod: 
	},
	rec: {
		area: ,
		inertia: ,
		centriod: 
	},
	ibeam: {
		area:,
		inertia: ,
		centriod: 
	},
	tbeam: {
		area: ,
		inertia: ,
		centriod: 
	},
	circle:{
		area: ,
		inertia: ,
		centriod: 
	},
	basic:{
		area: {
		},
		inertia: {
		},
		centriod: {
		}
	}


Data Objects

AllData = {
      memberid:'As member ID',
      startjoint:{ //Object joint
        jointtype: 'type name',
        y_coor: 'y coordinate value',
        r_coor: 'r coordinate value'
      },
      endjoint:{ //Object joint
        jointtype: 'type name',
        y_coor: 'y coordinate value',
        r_coor: 'r coordinate value'
      },
      load:{
        loadtype: 'load name',
        loadvalue: 'load value'
      },
      matTypeLength: {
        mattype: 'material name',
        matlength: 'length value',
        matelast: 'elasticity value'
      },
      matDim: {
        shape:'shape name', 
        dimensions: { //shape dimentions
			Base: null,
			Height: null,
			Web: null,
			Flange: null,
			Diameter: null
		} 
      },
      matCalc: { //  'Calc Object'
      	area: 'beam(Member) shape area',
      	inertia: 'beam(Member) second moment inertia',
      	centriod: 'beam(Member) centriod'
      }
    }


 

FormData = {
	Area:'',
	Base:'',
	Centriod:'',
	Diameter:'',
	Flange:'',
	Height:'',
	Inertia:'',
	Web:'',
	beamShape:'',
	elastic:'',
	jointBtype:'',
	jointEtype:'',
	loadAmount:'',
	loadType:'',
	memlength:'',
	r_bcoor:'',
	r_ecoor:'',
	y_bcoor:'',
	y_ecoor:'',
}



    count
    0	1	2	3
    01	23	45	67

	var objSample = function(){
		function doB(){
			return "B done";
		}

		function doGetA(){
			return this;
		}

		return {
			getA:function(){
				return 'getA';
			}
			,getDoB:function(){
				return doB();
			},
			DoA:function(){
				return doGetA();
			}
		}
	}


Leng: 	0		1		2		3
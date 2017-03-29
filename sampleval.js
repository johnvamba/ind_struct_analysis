/* Sample datastruct
  , sample : {
    members : 
    [
      {
      mlength: 'length of member',
      elast: 'elasticity of member',
      inertia: 'second moment inertia'
      }
    ],
    joints: //2
    [{
        jointtype: formData.jointBtype,
        y_coor: formData.y_bcoor,
        r_coor: formData.r_bcoor
      }],
    loads:[
      {
        loadtype:'load type',
        load: 'value'
      }
    ]
  }
*/
examples = {
  sample1 : { //data struct used in intiation on Beam Class
    name:'sample1',
    members: [
      {
        mlength: 3,
        elast: 200000,
        Inertia: 20000000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 4,
        elast: 200000,
        Inertia: 20000000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      }
    ], 
    joints:[{
          jointtype: 'fix',
          y_coor: '',
          r_coor: ''
        },
        {        
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'fix',
          y_coor: '',
          r_coor: ''
        }],
    loads:[
        {
          loadtype: 'equally',
          loadvalue: 40
        },
        {
          loadtype: 'noload',
          loadvalue: 0
        }]
  },sample2: { //data struct used in intiation on Beam Class
    name:'sample2',
    members: [
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      }
    ], joints:[{
          jointtype: 'fix',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {        
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'none',
          y_coor: 10,
          r_coor: ''
        }], /*
    */
    loads:[{
          loadtype: 'equally',
          loadvalue: '6'
        },
        {
          loadtype: 'equally',
          loadvalue: '6'
        },
        {
          loadtype: 'noload',
          loadvalue: ''
        }]
  }, sample3: { //data struct used in intiation on Beam Class
    name:'sample3',
    members: [
      {
        mlength: 15,
        elast: 200000,
        Inertia: 400000000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 15,
        elast: 200000,
        Inertia: 400000000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 15,
        elast: 200000,
        Inertia: 400000000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      }
    ], 
    joints:[{
          jointtype: 'pin',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {        
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'roller',
          y_coor: '',
          r_coor: 120
        }],
    loads:[{
          loadtype: 'equally',
          loadvalue: 44.6
        },
        {
          loadtype: 'two_point',
          loadvalue: 90
        },
        {
          loadtype: 'left_con',
          loadvalue: 25
        }]
  },case1: { //data struct used in intiation on Beam Class
    name:'sample2',
    members: [
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      }
    ], /*
      
    */
    joints:[{
          jointtype: 'pin',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {        
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'pin',
          y_coor: '',
          r_coor: ''
        }], /*
    */
    loads:[{
          loadtype: 'c_point',
          loadvalue: 10
        },
        {
          loadtype: 'equally',
          loadvalue: 5
        },
        {
          loadtype: 'c_point',
          loadvalue: 10
        }]
  },cload : { //data struct used in intiation on Beam Class
  name:'cload',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'c_point',
        loadvalue: 50
      }]
},rload : { //data struct used in intiation on Beam Class
  name:'rload',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'equally',
        loadvalue: 10
      }]
},twoload : { //data struct used in intiation on Beam Class
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'two_point',
        loadvalue: 20
      }]
}, combo : {
  name:'combo',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }, {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'two_point',
        loadvalue: 20
      },
      {
        loadtype: 'c_point',
        loadvalue: 50
      }]
}, center2 : {
  name:'center2',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }, {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'c_point',
        loadvalue: 20
      },
      {
        loadtype: 'c_point',
        loadvalue: 20
      }]
}, recx2 : {
  name:'recx2',
  members: [
    {
      mlength: 5,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }, {
      mlength: 5,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'equally',
        loadvalue: 10
      },
      {
        loadtype: 'equally',
        loadvalue: 10
      }]
}, two2 : {
  name:'two2',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }, {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'two_point',
        loadvalue: 20
      },
      {
        loadtype: 'two_point',
        loadvalue: 20
      }]
}, icombo : {
  name:'icombo',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }, {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'c_point',
        loadvalue: 50
      },
      {
        loadtype: 'two_point',
        loadvalue: 20
      }
      ]
}, leftcon : {
  name:'leftcon', //data struct used in intiation on Beam Class
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'left_con',
        loadvalue: 20
      }]
}, rightcon : {
  name:'rightcon', //data struct used in intiation on Beam Class
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'right_con',
        loadvalue: 20
      }]
}, triangle : { //data struct used in intiation on Beam Class
  name:'triangle',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    },
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },
      {
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      }],
  loads:[{
        loadtype: 'right_con',
        loadvalue: 20
      },
      {
        loadtype: 'left_con',
        loadvalue: 20
      }]
}, itriangle : { //data struct used in intiation on Beam Class
  name:'triangle',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    },
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'none',
        y_coor: '',
        r_coor: ''
      },
      {
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      }],
  loads:[{
        loadtype: 'left_con',
        loadvalue: 20
      },
      {
        loadtype: 'right_con',
        loadvalue: 20
      }]
}, more5 : { //data struct used in intiation on Beam Class
  name:'more5',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    },
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    },
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    },{
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    },{
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'basic',
      dimensions:{
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },{        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },
      {
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{        
        jointtype: 'fix',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'left_con',
        loadvalue: 20
      },{
        loadtype: 'noload',
        loadvalue: 20
      },{
        loadtype: 'right_con',
        loadvalue: 20
      },{
        loadtype: 'c_point',
        loadvalue: 20
      },{
        loadtype: 'two_point',
        loadvalue: 20
      }]
},reg3mem :{ //data struct used in intiation on Beam Class
  name:'3memReg',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'square',
      dimensions:{ //in Meters?
        Base: 100,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:null,
      Centriod:null
    },
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'rec',
      dimensions:{
        Base: 50,
        Height: 100,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    },
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'tbeam',
      dimensions:{
        Base: 100,
        Height: 100,
        Web: 50,
        Flange: 50,
        Diameter: null
      },
      Area_:2500,
      Centriod:50
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },
      {        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      },{        
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'left_con',
        loadvalue: 20
      },{
        loadtype: 'noload',
        loadvalue: 20
      },{
        loadtype: 'right_con',
        loadvalue: 20
      }]
},
  //Beam Types
sqbeam :{ //data struct used in intiation on Beam Class
  name:'sqbeam',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'square',
      dimensions:{ //in Meters?
        Base: 100,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:null,
      Centriod:null
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'equally',
        loadvalue: 20
      }]
},recbeam :{ //data struct used in intiation on Beam Class
  name:'recbeam',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'rec',
      dimensions:{ //in Meters?
        Base: 50,
        Height:100,
        Web: null,
        Flange: null,
        Diameter: null
      },
      Area_:null,
      Centriod:null
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'equally',
        loadvalue: 20
      }]
},tbeam :{ //data struct used in intiation on Beam Class
  name:'tbeam',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'tbeam',
      dimensions:{ //in Meters?
        Base: 100,
        Height: 100,
        Web: 20,
        Flange: 20,
        Diameter: null
      },
      Area_:null,
      Centriod:null
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'equally',
        loadvalue: 20
      }]
},ibeam :{ //data struct used in intiation on Beam Class
  name:'ibeam',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'ibeam',
      dimensions:{ //in Meters?
        Base: 100,
        Height: 100,
        Web: 20,
        Flange: 20,
        Diameter: null
      },
      Area_:null,
      Centriod:null
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'equally',
        loadvalue: 20
      }]
},cbeam :{ //data struct used in intiation on Beam Class
  name:'cbeam',
  members: [
    {
      mlength: 9,
      elast: 200000,
      Inertia: 2000000,
      shape:'circle',
      dimensions:{ //in Meters?
        Base: null,
        Height: null,
        Web: null,
        Flange: null,
        Diameter: 100
      },
      Area_:null,
      Centriod:null
    }
  ], 
  joints:[{
        jointtype: 'roller',
        y_coor: '',
        r_coor: ''
      },{
        jointtype: 'pin',
        y_coor: '',
        r_coor: ''
      }],
  loads:[
      {
        loadtype: 'equally',
        loadvalue: 20
      }]
  }

  ,case2: { //data struct used in intiation on Beam Class
    name:'case2',
    members: [
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      }
    ], joints:[{
          jointtype: 'fix',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'none',
          y_coor: '',
          r_coor: ''
        },
        {        
          jointtype: 'fix',
          y_coor: '',
          r_coor: ''
        }
        ], /*
    */
    loads:[{
          loadtype: 'equally',
          loadvalue: '6'
        },
        {
          loadtype: 'equally',
          loadvalue: '6'
        }]
  }
  ,case3: { //data struct used in intiation on Beam Class
    name:'case3',
    members: [
      {
        mlength: 2,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 4,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      },
      {
        mlength: 3,
        elast: 200000,
        Inertia: 400000,
        shape:'basic',
        dimensions:{
          Base: null,
          Height: null,
          Web: null,
          Flange: null,
          Diameter: null
        },
        Area_:null,
        Centriod:null
      }
    ], joints:[{
          jointtype: 'roller',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'none',
          y_coor: '',
          r_coor: ''
        },
        {        
          jointtype: 'none',
          y_coor: '',
          r_coor: ''
        },
        {
          jointtype: 'pin',
          y_coor: '',
          r_coor: ''
        }], /*
    */
    loads:[{
          loadtype: 'noload',
          loadvalue: ''
        },
        {
          loadtype: 'equally',
          loadvalue: '12'
        },
        {
          loadtype: 'noload',
          loadvalue: ''
        }]
  }


} //end of examples

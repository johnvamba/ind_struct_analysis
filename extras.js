var _b;
var _h;
var _b2;
var _h2;
var _diameter;
const PI = 3.14159265359;

// algo set
function calcArea(num){
	var total = num * num;
	return total;
}

function calcArea2(a,b){
	return a * b;
}

function calcAreaC(d){
	//check if sakto ang formula
	var c = calcArea(d) * (PI/4);
	return c;
}

function calcAreaI(a,b,c,d){ //base,height,web,flange
	var e = b - (2*d);
	var f = (2 * calcArea2(a,d)) + calcArea2(e,c);
	return f;
}

function calcAreaT(a,b,c,d){ //base,height,web,flange
	return calcArea2(a,d) + calcArea2(b-d,c);
}

function cent(a){
	return a/2;
}

function centT(b,d,Tf,Tw){
	var a = d-Tf;
	var c = b*Tf;
	return (Tw*(calcArea(a)/2) + (((2*d) - Tf)/2) * c) / (c + (a*Tw));
}

function iner(a){
	return (calcArea(a)*calcArea(a))/12;
}

function _inerA(b,h){
	return (b*h*h*h)/12;
}

function _inerB(b,h){
	return (h*b*b*b)/12;
}

function inerC(a){
	return (d*d*d*d) * (PI/64);
}

function inerT(b,d,Tf,Tw){
	var y = centT(b,d,Tf,Tw);
	var a = d-Tf;
	var c = b*Tf;
	var e = a+(Tf/2)-y;
	return (a*Tw*(y-(a/2))*(y-(a/2))) + _inerA(Tw,a) + (c*e*e) + _inerA(b,Tf);
}


thisGlobal = {
  showGraph:function(){}, //from illu button -> modifybase on paper js
  pathList:function(obj){},
  showPath:function(path){},
  basicDrawOBJ:function(obj){}, //creates drawObjs on paperscript
  dataCalled:function(xcoor){ //called onMouseButton paperclass
    console.log(xcoor);
    var c = dataOBJ.getCalcMSC(xcoor.toFixed(2));
    // console.log('called dataOBJ', xcoor, 'object',c);
    return c;
  },
  // reactList:function(obj){},
  curveOn:function(member){},
  entry: function(x){}
}


ceilings=null; /*
{ momentCeil: 836.45,
 shearCeil: 68.57, 
 shearB4Ceil: 51.43, 
 deflectCeil: 0.0002091125 
}*/
simplifiers = {
  changePointRate:function(lowest){
    // if(lowest<10){
    //   return 0.05;
    // }
    return lowest * 0.05;
  },
  changeDistRate:function(thisLength){
    return multipliers.spacedistance * (thisLength/multipliers.shortLength);
  },changeMomentRate:function(react){
    if(ceilings.momentCeil!==undefined){
      return 100 * (react/ceilings.momentCeil);
    }
    min=1; //global var?
    return highest * min;
  },changeShearRate:function(react){
    if(ceilings.shearB4Ceil!==undefined){
      return 100 * (react/ceilings.shearB4Ceil);
    }
  },changeDeflectRate:function(react){
    if(ceilings.deflectCeil!==undefined){
      return 20 * (react/ceilings.deflectCeil);
    }
    min=1; //global var?
    return highest * min;
  }

}

var multipliers = {
  shearstresses:9,
  distanceRate: 50 //pixel distance of cm or meter/100
  ,reactRate:1
  ,momentForceRate:0.25
  ,spacedistance: 200, //per lowest member
  canvasWidth:0,
  shortLength:1
}

//Others
// var sampleSegment = [[400,20],[500,24]];
// view.resize = true;

// Paths
var paths = ['shearPath', 'momentPath', 'deflectionPath', 'shearStress', 'bendStress'];
var 
	pathgroup = new Group(),
	shearPath = shearPath = new Path({
		name: 'shearPath',
		pivot:[-1,0],
		// position: [0, view.center.y+100],
		name2: 'Shear Force',
		segments: [0,0],
		strokeColor: 'red',
		strokeWidth: 2
		// fillColor:'red'
	}),

	momentPath = new Path({
		position: view.center,
		name: 'momentPath',
		name2: 'something',
		pivot:[-1,0],
		segments: [0,0],
		strokeColor: 'green',
		strokeWidth: 2
		// fillColor: 'green'
	}),
	deflectionPath = new Path({
		// position: view.center - 100,
		name: 'deflectionPath',
		segments: [0,0],
		pivot:[-1,0],
		strokeColor: 'blue',
		strokeWidth: 2,
		fillColor:'blue'
	}),
	intersectLine = new Path({
		position:view.center,
		segments:[[0,500],[0,-500]],
		strokeColor: 'black',
		strokeWidth:1,
		visible:false,
		opacity:.8
	}),
	intersectText = new PointText({
		content: '',
		pivot: [0,0],
		fillColor: 'black'
	})
	// shearShape, //transfer to different paperscript.
	// bendShape //transfer to different paperscript.
	;

	// pathgroup.addChild(shearPath);
	// init();
	// shearPath.position = new Point(20,view.center.y);
	// shearPath.visible = false;

// console.log(view.bounds);
var femBase,msc,drawn=false;

function init(){ //setups dividing bars

}

function showDivGraph(){ //non calculated
	// intersectLine.position = [0,view.center.y];
	intersectLine.visible = false;
}

function showCalcGraph(){ //calculated
	//get a mock calc place for shear, moment, deflection
	if(!drawn){
		//setup segments
		for (var i = 0; i < femBase.length; i++) {
			var y = femBase[i];
			// var z = multipliers.distanceRate;
			console.log(y._i*multipliers.distanceRate,-y.x.shearforce*multipliers.reactRate);
			shearPath.add(new Point(y._i*multipliers.distanceRate, -y.x.shearforce*multipliers.reactRate));
			momentPath.add(new Point(y._i*multipliers.distanceRate,-y.x.momentforce*multipliers.momentForceRate));
			// deflectionPath.add(new Point(y._i*50, y.x.deflection*10));
			// // femBase[i]
		}
		// shearPath.simplify();
		shearPath.position = [0, view.center.y];
		momentPath.position = [0, view.center.y];

		drawn = true;
	}


}

function onMouseDown(event){
	intersectLine.visible = true;
	intersectLine.position.x = event.point.x;

	msc = showIntersect(shearPath);
	thisGlobal.dataCalled(msc); //modify later or remove
	thisGlobal.xVal = msc;
	console.log(msc);
}


//Helpers
function showIntersect(path){

	var intersections = intersectLine.getIntersections(path);
  var _x = intersectLine.position.x / multipliers.distanceRate;
	// var 
	for (var i = 0; i < intersections.length; i++) {
        new Path.Circle({
            center: intersections[i].point,
            radius: 5,
            fillColor: '#009dec'
        }).removeOnDown();
        // intersectText.point = [5,0];
        intersectText.position = [intersectLine.position.x+10, intersections[i].point.y+15];
        console.log(intersections[i].point.x,'intersections.x');

  			var called = thisGlobal.dataCalled(_x);

        // intersectText.content = path.name2 +': ' + intersections[i].point.y+ '<br> Something'; 
        intersectText.content = path.name2 +': ' + called.shearforce+ '<br> Something';
  }



  return _x;
  // thisGlobal.showOthersOnX(_x);

}


function setBase(obj){
	femBase=obj;
}

function modifyBase(){
	showDivGraph();
	showCalcGraph();
	console.log(femBase);
}

thisGlobal.pathList = setBase;
thisGlobal.showGraph = modifyBase;

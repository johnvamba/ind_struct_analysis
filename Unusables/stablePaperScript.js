window.onload = function(){
var canvas = document.getElementById('mainCanvas');
// Create an empty project and a view for the canvas:
canvas.width = 1038;
paper.setup(canvas);
	//shortcuts
	var view = paper.view,
		bounds = paper.view.bounds,
		margin = 75,
		drawObjs;
	;
	/*
		canvas objects!
	*/
	var intersectLine = new paper.Path({
			position: paper.view.center,
			segments:[[0,0],[0,paper.view.bounds.bottom]],
			strokeColor: 'black',
			strokeWidth:1,
			visible:false,
			opacity:.8
		}),
		intersectText = new paper.PointText({
			content: '',
			pivot: [0,0],
			fillColor: 'black'
		});

		//Beam
	var	beam = new paper.Shape();
	var	separators = new paper.CompoundPath({
			strokeColor: 'black',
			// strokeWidth:1,
			opacity:.1
		})
		;
		//Modify later!
		// shearShape = new paper.Path({
		// 	// pivot:[0,0],
		// 	position: [15, paper.view.bounds.y - 25],
		// 	strokeColor: 'red',
		// 	strokeWidth: 1
		// }), //transfer to different paperscript.
		// bendShape = new paper.Path({
		// 	// pivot:[0,0],
		// 	position: [200, paper.view.bounds.y - 25],
		// 	strokeColor: 'red',
		// 	strokeWidth: 1
		// }),//transfer to different paperscript.
		
		// Paths
	var paths = ['shearPath', 'momentPath', 'deflectPath'];
	var pathColor = ['red','green','blue'];
	var others = ['shearStress', 'bendStress'];
	// var layer = new paper.Layer();

	var pathgroup = new paper.Group();
	//initiate contents of pathgroup;
	for (var i =0 ; i < paths.length;i++){
		pathgroup.addChild(
			new paper.Path({
				name: paths[i],
				strokeColor: pathColor[i],
				fillColor: pathColor[i],
				segments:[[0,0]],
				strokeWidth:2
			})
		);
		pathgroup.children[i].fillColor.alpha = 0.2;
	} 

	var reactOBJ,
		drawnGraph=false,
		drawnBasic=false;
	// pathgroup.addChild(beam); // on index 3
	//paper and/or paperscope callbacks
	/*
		PATHS Callbacks
	*/
	pathgroup.on({
		mousedrag: function(event){
			if(paper.Key.isDown('d')){
				if((pathgroup.bounds.left < 10 || pathgroup.bounds.right > view.bounds.right - 10) && !pathgroup.isInside(view.bounds)){
					console.log('dragged');
					pathgroup.position.x += event.delta.x;
					if(pathgroup.bounds.left > 10 || pathgroup.bounds.right < view.bounds.right - 10){
						pathgroup.position.x -= event.delta.x;
					}
				}
			}
		} 
	});

	view.onMouseDown = function(event){ 
		if(paper.Key.isDown('d')){
			console.log('something');
			clear();
			return;
		}
		if(event.point.x > pathgroup.bounds.left && event.point.x < pathgroup.bounds.right){
			intersectLine.visible = true;
			intersectText.visible = true;
			intersectLine.position.x = event.point.x;
			showIntersect(pathgroup.children[1]);
		} else {
			intersectLine.visible = false;
			intersectText.visible = false;
		}
		// thisGlobal.dataCalled(msc); //modify later or remove
		if(event.modifiers.space){
			console.log(event.point.x,event.point.y);
		}
	}


	//		Helpers		//
	function preGraph(){
		if(!drawnBasic){
			console.log('establish lanes');
			console.log(drawObjs);
			//part1 clearother paths
			// console.log(multipliers.shortLength);

			//part 2.1 extend beam rectangle
			//		Test 1
			beam = new paper.Path.Rectangle({
				size: [simplifiers.changeDistRate(drawObjs.totalLength),10],
				point: [0,-5],
				name:'Beam',
				fillColor: 'grey',
				strokeColor: 'black',
				strokeWidth:1,
				opacity:.1
			})
			pathgroup.children[3] = beam;

			//part 2 create unitary paths separating members
			// separators.addChild({})
			var _ends = new Array();
			var agLength = 0;
			for (var i = 0; i < drawObjs.members.length; i++) {
				agLength += drawObjs.members[i].mlength;
				// console.log(agLength);
				if(_ends.length === 0){
					_ends.push(
						new paper.Path({
							segments: [[0, -125],[0, 125]]
						})
					);
				}

				_ends.push(
					new paper.Path({
						segments: [
							[simplifiers.changeDistRate(agLength), -125],
							[simplifiers.changeDistRate(agLength), 125]
						]
					})
				);
			}
			// console.log(_ends);
			// if(separators.hasChildren()){
			// 	separators.removeChildren();
			// }
			separators.children = _ends;
			// console.log(beam.isSibling(pathgroup));
			pathgroup.moveBelow(beam);
			separators.moveBelow(beam);
			pathgroup.children[4] = separators;

			// console.log(pathgroup.isAbove(beam));

			//part 4 include on pathgroup

			// positionCenter();

			drawnBasic = true;
		}
	}

	function clear(){ //non calculated
		intersectLine.visible = false;
		intersectText.visible = false;
		intPoints.visible = false;
	}

	function showCalcGraph(){ //calculated
		//get a mock calc place for shear, moment, deflection
		if(!drawnGraph){
			//setup segments.
			var _shear=new Array();
			var _moment=new Array();
			var _deflect=new Array();
			for (var i = 0; i < reactOBJ.length; i++) {
				// var y = reactOBJ[i];
				// _shear.push(new paper.Point(
				// 	simplifiers.changeDistRate(reactOBJ[i]._i), 
				// 	-reactOBJ[i].x.shearforce * multipliers.reactRate)
				// );
				_moment.push(new paper.Point(
					simplifiers.changeDistRate(reactOBJ[i]._i),
					-reactOBJ[i].x.momentforce*multipliers.momentForceRate)
				);
				/*Original moment
				_moment.push(new paper.Point(
					reactOBJ[i]._i*multipliers.distanceRate,
					-reactOBJ[i].x.momentforce*multipliers.momentForceRate)
				);
				*/
				// _deflect.push(new paper.Point(
				// 	reactOBJ[i]._i*multipliers.distanceRate,
				// 	-reactOBJ[i].x.deflection*multipliers.momentForceRate)
				// );
				
			}
			// var shear =;
			/*
			`	Modify Path generation.
			*/
			// pathgroup.children[0].insertSegments(1, _shear);
			pathgroup.children[0].segments = createShearPath();
			// pathgroup.children[0].fullySelected = true;

			pathgroup.children[1].insertSegments(1, _moment);

			/*Test CreateShearPath*/
			// console.log(shear); // addshearHere
			// pathgroup.children[2] = shear;
			// pathgroup.children[2].selected = true;
			// pathgroup.children[2].insertSegments(1, _deflect);


			// paper.project.activeLayer.addChild(pathgroup.children[0]);
			// paper.project.activeLayer.position = pathgroup.position;
			// pathgroup.children[2].bringToFront();

			console.log('call once');
			// pathgroup.reverseChildren();

			drawnGraph = true;
		} // end draw process
		// positionCenter();

		// if (!pathgroup.isInside(view.bounds)){
		// 	// console.log('not dragged');
		// 	pathgroup.bounds.left = view.bounds.left - 100; //streches beam :(
		// }
			// console.log(beam.isSibling(pathgroup));
			// console.log('is equal to separators',pathgroup == separators);
			// pathgroup.moveBelow(beam);

			// console.log('is above?',pathgroup.isAbove(beam));


	} // end of show calc
	// console.log('Something',paper.project.activeLayer.position, pathgroup.position);
	var oldPosition;
	function positionCenter(save){
		if(save){
			oldPosition = pathgroup.position;
		}

		// console.log(pathgroup.bounds.top, pathgroup.bounds.bottom, view.center.y);
		if(pathgroup.bounds.top !== view.bounds.top){
			pathgroup.position = {
				x: view.center.x,
				y: pathgroup.bounds.bottom
			};		
		}

		// pathgroup.position.x = view.center.x;
		// pathgroup.bounds.top = view.bounds.top;

		// console.log(pathgroup.bounds.top, view.center.y);	
	}

	var intPoints=new paper.Path.Circle({
		        radius: 5,
		        fillColor: '#009dec'
		      });
	function showIntersect(path){

		var intersections = intersectLine.getIntersections(path);
		if(intersections){

		  	var _x = (intersectLine.position.x - pathgroup.bounds.left )/ multipliers.distanceRate; //sakto? sort of. NOPE!
			console.log(intersectLine.position.x,pathgroup.bounds.left,multipliers.distanceRate);
			// var 
			for (var i = 0; i < intersections.length; i++) {
		      intPoints = new paper.Path.Circle({
		        center: intersections[i].point,
		        radius: 5,
		        fillColor: '#009dec'
		      }).removeOnDown();
		      // intersectText.point = [5,0];
		      intersectText.position = [intersectLine.position.x+10, intersections[i].point.y+15];


				var called = thisGlobal.dataCalled(_x);
				console.log(_x,called);

		      // intersectText.content = path.name2 +': ' + intersections[i].point.y+ '<br> Something'; //doesn't break
		      intersectText.content = path.name +': ' + called.shearforce;
		      // console.log(intersectLine.position.x);

		      //change shearstress
		      //change bendstress
			  }// end for
		}

	  return _x;
	}

	//	interconnected methods	//
	function splits(obj){
		reactOBJ=obj;
		console.log(reactOBJ);
	} //adds partitions of reactions as objects
	thisGlobal.pathList = splits;

	function beamObj(objs){
		drawObjs = objs;
		drawnBasic = false;
	}//reiterate members
	thisGlobal.basicDrawOBJ = beamObj;

	function modifyBase(){ //called everytime illu button pressed
		preGraph();
		clear(); //hides miscellaneous items.

		if(reactOBJ !== undefined){
			showCalcGraph();
		}
		// console.log('layers:',paper.project.layers);
		positionCenter();
	}
	thisGlobal.showGraph = modifyBase;

	//special functions
	var reactions; //objects

	function createShearPath(){
		var path = new paper.Path({
			segments: [0,0], //start
			// origForce: 0
		});
		var step = new paper.Point({
			x:0,
			y:0
		});
		var vLen = 0;
		loadHelper = {
			equally:function(force,len){
				//step.x = len*multipliers.distanceRate; //oiginal
				step.x = simplifiers.changeDistRate(len);
				step.y = -force * multipliers.reactRate;
				path.lineTo(step);
				path.lastSegment.origForce = force;
			},left_con:function(force,len,mlen){
				/*		Method 1 DONTREMOVE	*/
				/*
					temp = new paper.Path();
					// temp.add(path.lastSegment);
					// tempA = new Array();
					prevLength = vLen-mlen;
					for (var i = 0; i < reactOBJ.length; i++) {
						if(reactOBJ[i]._i >= prevLength && reactOBJ[i]._i <= vLen){
							temp.add(new paper.Point(
								simplifiers.changeDistRate(reactOBJ[i]._i),
								-reactOBJ[i].x.shearforce* multipliers.reactRate)
							);
						}
					}
					// temp.fullySelected = true;
					// temp.simplify();
					path.join(temp);
				*/
				step.x = simplifiers.changeDistRate(len);
				step.y = -force * multipliers.reactRate;
				path.lineTo(step);
				path.lastSegment.origForce = force;
			},right_con:function(force,len, mlen){
				step.x = simplifiers.changeDistRate(len);
				step.y = -force * multipliers.reactRate;
				path.lineTo(step);
				path.lastSegment.origForce = force;
			},c_point:function(force,len,whole){
				// whole = drawObjs.members[i].mlength;
				disWalk = vLen;
				half = whole/2;
				console.log(whole,disWalk,half);
				tent = (disWalk - whole) + half;
				loadHelper.noload(force,tent);
				force2 = thisGlobal.dataCalled(tent);
				loadHelper.suppStep(force2.shearforce);
				loadHelper.noload(force2.shearforceb4,disWalk);
			},two_point:function(force,len,whole){
				// whole = drawObjs.members[i].mlength;
				disWalk = vLen;
				third = whole/3;
				tr = third;
				while(tr < whole){
					tent = (disWalk - whole) + tr;
					loadHelper.noload(force,tent); //walks x coor
					force2 = thisGlobal.dataCalled(tent);
					loadHelper.suppStep(force2.shearforce); //dives y coor
					loadHelper.noload(force2.shearforceb4, (disWalk - whole)+ tr);
					tr += third;
				}
				loadHelper.noload(force,disWalk);
			},noload:function(force,len){
//				step.x = len*multipliers.distanceRate; //original
				step.x = simplifiers.changeDistRate(len);
				force = path.lastSegment.origForce;
				path.lineTo(step);
				path.lastSegment.origForce = force;
			},suppStep:function(react){
				step.y = -react * multipliers.reactRate;
				path.lineTo(step);
				path.lastSegment.origForce = react;
			}
		}

		for (var i = 0; i < drawObjs.members.length; i++) { //iterates joints
			var walk;
			if(i==0){
				walk = thisGlobal.dataCalled(0).shearforce;
				loadHelper.suppStep(walk);
			}
			if(drawObjs.members[i] !== undefined){
				x=drawObjs.members[i].mlength
				vLen += x;
				walk = thisGlobal.dataCalled(vLen);
				loadHelper[drawObjs.loads[i].loadtype](walk.shearforceb4,vLen,x);
				loadHelper.suppStep(walk.shearforce);
			}
		}

						/* check path origForce*/
		for (var i = 0; i < path.segments.length; i++) {
			var x = path.segments[i];
			console.log('origForce',x.origForce,'; origPosition', x.point.y);
		}
		
		return path.segments;
	}

	function createSegmentMoment(){

	}
}//end project

//add later?





/*
	to Do:


*/
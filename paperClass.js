window.onload = function(){
var canvas = document.getElementById('mainCanvas');
// Create an empty project and a view for the canvas:
canvas.width = 1038;
paper.setup(canvas);

	var applied = { // if objects are present
		allobj:null,
		splits:null,
	};
	center = paper.view.center;
	margin = 100;
	var mainGroup=new paper.Group();
	var intersectLine = new paper.Path({ //remove later
		position: paper.view.center,
		segments:[[0,0],[0,paper.view.bounds.bottom]],
		strokeColor: 'black',
		strokeWidth:1,
		visible:false,
		opacity:1
	}),
	intersectText = new paper.PointText({
		content: '',
		pivot: [0,0],
		fillColor: '#009dec',
		fontWeight: 'bold',
		visible:false,
		// shadowColor: new paper.Color(0, 0, 0),
		// shadowBlur: 10,
		// shadowOffset: new paper.Point(2, 2)
	});

	var PathGroup = function(){
		// console.log(allobj === undefined , splits === undefined);
		//pre objs
		var path = ['shearPath', 'momentPath']; //rejected deflectPath
		var pathColor = ['red','green','blue'];
		var others = ['shearStress', 'bendStress'];

		//required paper objs
		this.paths = new paper.Group({
			pivot:[0,0]
		});
		this.textforces = new paper.Group({
			pivot:[0,0],
			visible:false
		});

		this.applyObj = function(allobj,splits){ //do changes/building here
			if(allobj === undefined || splits === undefined){ //does not procede if splits objs are lacking
				return;
			}

			if(this.paths.hasChildren() && this.textforces.hasChildren()){
				this.clear();
			}

			var shear;
			for (var i =0 ; i < path.length;i++){ //for funciton generating path
				this.paths.addChild(
					// new paper.Path({ //original
					new paper.Path({
						name: path[i],
						strokeColor: pathColor[i],
						fillColor: pathColor[i],
						segments:[0,0],
						strokeWidth:2
					})
				);
				this.paths.children[i].fillColor.alpha = 0.2;

				var _moment=new Array();
				var _deflect=new Array();
				if(this.paths.children[i].name === 'shearPath'){
					shear = createShearPath();
					this.paths.children[i].segments = shear.segments;
				} else if(this.paths.children[i].name === 'momentPath'){
					for (var j = 0; j < applied.splitObjs.length; j++) {
						_moment.push(new paper.Point(
							simplifiers.changeDistRate(applied.splitObjs[j]._i),
							-simplifiers.changeMomentRate(applied.splitObjs[j].x.momentforce))
						);
						_deflect.push(new paper.Point(
							simplifiers.changeDistRate(applied.splitObjs[j]._i),
							-simplifiers.changeMomentRate(applied.splitObjs[j].x.deflection))
						);
					}
					this.paths.children[i].addSegments(_moment);
					endPoint = this.paths.children[i].lastSegment;
					this.paths.children[i].add(endPoint.point.x,0); //bad decision //easy fix
				} else if(this.paths.children[i].name === 'deflectPath'){
					for (var j = 0; j < applied.splitObjs.length; j++) {
						_deflect.push(new paper.Point(
							simplifiers.changeDistRate(applied.splitObjs[j]._i),
							-simplifiers.changeDeflectRate(applied.splitObjs[j].x.deflection))
						);
					}
					this.paths.children[i].addSegments(_deflect);
					// endPoint = this.paths.children[i].lastSegment;
					// this.paths.children[i].add(endPoint.point.x,0); //bad decision //easy fix
				}

				this.textforces.addChild(new paper.Group({//add later
					name:path[i],
					fillColor:pathColor[i],
					// pivot:[0,0]
				}));

				if(this.textforces.children[i].name === 'shearPath'){
					for(var j = 0;j < shear.segments.length;j++){ 
						segment = shear.segments[j];
						if(segment.origForce !== undefined){
							// console.log(shear.segments[i].origForce);
							tval = segment.point.x < center.x;
							var sF = new paper.PointText({
								content: ' '+ segment.origForce +' ',
								fontSize: 10,
								fillColor: 'red',
								justification: (tval ? 'left' : 'right')
							});
							sF.point = {
								x : segment.point.x + (segment.point.x < center.x ? 5 : -5),
								y : segment.point.y + 6
							}
							this.textforces.children[i].addChild(sF);
						}
					}
				}
			}
			x = {
				x: beamMsc.beam.bounds.left,
				y: center.y
			}

			this.paths.position = x;
			this.textforces.position =x;

			this.paths.bringToFront();
			beamMsc.beam.opacity = 0.3;

			// if(this.paths.)

		} //end of ApplyObj


		this.active;
		this.changePathActive = function(path){ //pathname
			for (var i = 0; i < this.paths.children.length; i++) {
				this.paths.children[i].visible = false;
				if (path === undefined || path === 'allPath'){
					this.paths.children[i].visible = true;
					this.active = null;
				} else if(this.paths.children[i].name === path){
					this.paths.children[i].visible = true;
					this.active = this.paths.children[i];
				}
			}
		}

		this.clear = function(){
			intersectLine.visible = false;
			intersectText.visible = false;
			this.paths.removeChildren();
			this.textforces.removeChildren();
			this.paths.position = [0,0];
			this.textforces.position = [0,0];
		}
	}

	var MscGroup = function(){ //objects beam
		this.beam;
		this.group = new paper.Group();
		this.supports = new paper.CompoundPath({
			strokeColor: 'black',
			opacity:.1
		});

		this.applyObj = function(allobj){ //creates everything in between
			if(allobj === undefined){
				return;
			}

			if(this.supports.hasChildren() && this.group.hasChildren()){
				this.clear();
			}
			
			//object creation
			this.beam = new paper.Path.Rectangle({ 
				size: [simplifiers.changeDistRate(applied.allobj.totalLength),10],
				point: [0,-5],
				name:'Beam',
				fillColor: 'grey',
				strokeColor: 'black',
				strokeWidth:1,
				// opacity:.5
			});

			//supports
			var _ends = new Array();
			var agLength = 0;
			for (var i = 0; i < applied.allobj.members.length; i++) {
				agLength += applied.allobj.members[i].mlength;
				// console.log(agLength);
				if(_ends.length === 0){
					_ends.push(
						new paper.Path({
							segments: [[0, -200],[0, 200]]
						})
					);
				}

				_ends.push(
					new paper.Path({
						segments: [
							[simplifiers.changeDistRate(agLength), -200],
							[simplifiers.changeDistRate(agLength), 200]
						]
					})
				);
			}
			this.supports.children = _ends;

			//position of this objects
			this.beam.position = center;
			this.supports.position = center;

			if(!this.beam.isInside(paper.view.bounds)){
				//add to maingroup
				mainGroup.addChild(this.beam);
				mainGroup.addChild(this.supports);
				mainGroup.addChild(pathG.paths);
				mainGroup.addChild(pathG.textforces);
			}
		} //end of object generation
		

		this.clear = function(){
			this.group.removeChildren(); //clears group
			this.beam.remove(); // remove the path
			this.supports.removeChildren(); //remove anything inside
			this.beam.position = [0,0];
			this.supports.position = [0,0];
		}
		//beam
		//supports
	} // end of MSC Object


	var Stresses = function(){
		this.group = new paper.Group({
			pivot:[0,0]
		});
		sheartext = new paper.Group();
		label = new paper.Group();
		label.addChild(new paper.PointText({
				content: 'Shear Stresses',
				point: [10,10],
				fontSize: 12,
				fillColor: 'black',
				justification: 'left'
			}));
		label.addChild(new paper.PointText({
				content: 'Bending Stresses',
				point: [10,160],
				fontSize: 12,
				fillColor: 'black',
				justification: 'left'
		}));
		this.backPanel = new paper.Path.Rectangle({
			point: [0,0],
			fillColor:'white',
			size: [150,paper.view.bounds.bottom],
			opacity: .75,
			visible: false,
		});
		shearShape = new paper.Path({
			strokeColor: 'black',
			segments: [[0,25],[0,125]],
			strokeWidth: 1.5,
			fillColor:'black'
		}), //transfer to different paperscript.
		shearShape.fillColor.alpha = 0.2;
		shearStep = 100 / (multipliers.shearstresses - 1); //divided by parts, means parts + 1 = edges; requires 7 edges
		var walkstep = 25;
		for (var i = 1; i < multipliers.shearstresses +1; i++) {
			shearShape.insert(i,[0,walkstep]);
			var sF = new paper.PointText({
				content: '',
				point: [0,walkstep+5],
				fontSize: 10,
				fillColor: 'black',
				justification: 'left'
			});
			sheartext.addChild(sF);
			walkstep += shearStep;
		}
		// shearShape.smooth({type:'asymmetric'}); //mas bati

		bendShape = new paper.Path({
			strokeColor: 'black',
			strokeWidth: 1.5,
			segments: [[0,175],[0,275]],
			fillColor:'black'
		});
		bendShape.fillColor.alpha = 0.2;

		//rewrite this part later
				bendShape.insert(1,[0,175]);
				var top = new paper.PointText({
					content: '',
					point: [0,180],
					fontSize: 10,
					fillColor: 'black',
					justification: 'left'
				});
				bendShape.insert(2,[0,225]);
				bendShape.insert(3,[0,275]);
				var bottom = new paper.PointText({
					content: '',
					point: [0,280],
					fontSize: 10,
					fillColor: 'black',
					justification: 'left'
				});
		// console.log(shearShape.segments,bendShape);
		this.group.addChildren([label,sheartext,shearShape,bendShape,top,bottom]);
		this.group.position = [20,20];
		warn = new paper.PointText({
				content: 'Does not support Irregular Member',
				point: [30,30],
				fontSize: 12,
				fillColor: 'black',
				justification: 'left',
				visible:false
			});
		this.backPanel.moveBelow(this.group);

		this.show = function(distance){

			function helper(pathname){
				if(pathname === 'allPath'){
					return;
				} else if(pathname === 'shearPath'){
					return '  Shear Force: ' + called.shearforce + 'kN at '+distance+'m  ';
				} else if(pathname === 'momentPath'){
					return '  Moment Force: ' + called.momentforce + 'kN-m at '+distance+'m  ';
				} else if(pathname === 'deflectPath'){
					return '  Deflecting: ' + called.deflection + 'm at '+distance+'m  ';
				}
			}
			// this.group.visible = true;
			var called = thisGlobal.dataCalled(distance);

			//Changes on point
			var intPoints;
			// console.log('do it with',distance,intersectLine.position.x);
			if(pathG.active !== 'allPath'){
				var intersections = intersectLine.getIntersections(pathG.active);
				if(intersections){
					for (var i = 0; i < intersections.length; i++) {
						if(intersections[i].point.y !== beamMsc.beam.position.y && intersections.length > 1){ //restricts point at 0
					      intPoints = new paper.Path.Circle({
					        center: intersections[i].point,
					        radius: 5,
					        fillColor: '#009dec'
					      }).removeOnDown();
						} else if(intersections.length === 1){
							intPoints = new paper.Path.Circle({
					        center: intersections[i].point,
					        radius: 5,
					        fillColor: '#009dec'
					      }).removeOnDown();
						}
							intersectText.visible = true;
							intersectText.bringToFront();
							intersectText.position= [intersectLine.position.x, (intersections[i].point.y < center.y ? intersections[i].point.y - 10 : intersections[i].point.y + 20)];
							intersectText.content = helper(pathG.active.name);
							intersectText.justification = (intersections[i].point.x < center.x ? 'left' : 'right');

						// console.log(pathG.active.name);
					}
				}
			}
			// console.log(called);
			if(called.beamtype === 'basic'){
				this.hideAll();
				warn.visible = true;
				return;
			}
			warn.visible = false;

			if(beamMsc.beam.intersects(stress.backPanel)){
				stress.backPanel.visible = true;
			}

			//show everything
			shearShape.visible = true;
			bendShape.visible = true;
			label.visible = true;
			for (var i = 0; i < sheartext.children.length; i++) {
				sheartext.children[i].visible = true;
			}
			top.visible = true;
			bottom.visible = true;
			function shearLimit(x){
				var max;
				for (var i = 0; i < called.shearStress.length; i++) {
					s = called.shearStress;
					if(i==0 || max<=s[i]){
						max = s[i];
					}
				}
				if (max == 0){
					return 0;
				}
				return 30 * (x<0&&max<0? -max/-x : x/max);
			}
			//transform everything
			for (var i = 1; (i-1) < multipliers.shearstresses; i++) { //for shear
				shearShape.segments[i].point.x = shearLimit(called.shearStress[i-1]) +20; //add function to dynamically fix
				shearShape.segments[i].selected = true;
				sheartext.children[i-1].content = parseFloat(called.shearStress[i-1].toFixed(2)) + ' kPa';
				sheartext.children[i-1].point.x = shearLimit(called.shearStress[i-1]) + 30; //add function to dynamically fix
			}
			// console.log(shearShape.segments);

			function limitPoint(x){
				max = (called.bendingStress.top > called.bendingStress.bottom) ? called.bendingStress.top : called.bendingStress.bottom;
				if(max==0){
					max = 1;
				}
				return 30 * x/max;
			}

			bendShape.segments[1].point.x = limitPoint(called.bendingStress.top)+20;
			bendShape.segments[1].selected = true;
			top.content = parseFloat(called.bendingStress.top.toFixed(2)) + ' kPa';
			top.point.x = limitPoint(called.bendingStress.top) + 30; //add function to dynamically fix
			bendShape.segments[2].point.y =  bendShape.segments[3].point.y - (100 * called.bendingStress.centriod/called.bendingStress.height);
			bendShape.segments[3].point.x = limitPoint(called.bendingStress.bottom)+20;
			bendShape.segments[3].selected = true;
			bottom.content = parseFloat(called.bendingStress.bottom.toFixed(2)) + ' kPa';
			bottom.point.x = limitPoint(called.bendingStress.bottom) + 30; //add function to dynamically fix
		
		};
		// this.hideFlag = function(){}
		this.hideAll = function(){
			warn.visible = false;
			label.visible = false;
			shearShape.visible = false;
			shearShape.fullySelected = false;
			bendShape.visible = false;
			bendShape.fullySelected = false;
			stress.backPanel.visible = false;
			for (var i = 0; i < sheartext.children.length; i++) {
				sheartext.children[i].visible = false;
			}
			top.visible = false;
			bottom.visible = false;
		}
		// this.change = function(){}
	}

	paper.view.on({
		mousedown: function(event){
			if(applied.splitObjs === undefined || paper.Key.isDown('d')){ // if path is missing
				// console.log('something');
				return;
			}
			stress.hideAll();
			intersectLine.visible = true;

			if(event.point.x > beamMsc.beam.bounds.left && event.point.x < beamMsc.beam.bounds.right){
				intersectLine.position.x = event.point.x;
				// console.log('ping center');
			} else if(event.point.x < beamMsc.beam.bounds.left){
				intersectLine.position.x = beamMsc.beam.bounds.left;
			} else if(event.point.x > beamMsc.beam.bounds.right){
				intersectLine.position.x = beamMsc.beam.bounds.right;
			}
			// console.log(event.point.x, beamMsc.beam.bounds.left,beamMsc.beam.bounds.right);
			var distance =  multipliers.shortLength * ((intersectLine.position.x - beamMsc.beam.bounds.left )/ multipliers.spacedistance);
			// console.log(distance);
			stress.show(parseFloat(distance.toFixed(2)));
		},
		mousedrag: function(event){
			event.modifiers.d = paper.Key.isDown('d');
			// console.log(this);
			if(event.modifiers.d){
				if(intersectLine.visible || intersectText.visible){
					intersectLine.visible = false;
					intersectText.visible = false;
				}
				// console.log('Should move');
				if (mainGroup.bounds.left < margin + 60 || mainGroup.bounds.right > paper.view.bounds.right - margin + 50){
					mainGroup.position.x += event.delta.x;
					if(mainGroup.bounds.left > margin + 60 || mainGroup.bounds.right < paper.view.bounds.right - margin + 50){
						mainGroup.position.x -= event.delta.x;
					}
				}
			} else {
				return;
			}
		}
	});

	function entry(int){ //change here
		stress.hideAll();
		intersectLine.visible = true;
		intersectLine.position.x = beamMsc.beam.bounds.left + simplifiers.changeDistRate(int);
		// console.log("read on paperscript")
		stress.show(parseFloat(int));
	}
	thisGlobal.entry =entry;

	//sub functions //don't touch here
	var pathG,beamMsc;
		beamMsc = new MscGroup();
		pathG = new PathGroup();
		stress = new Stresses();

	var drawn ={
		basic:false,
		splits:false
	}
	function steps(beamObj,splitObjs){ //put everything here
		// if(mainGroup.hasChildren()){
		// 	mainGroup.removeChildren();
		// }
		stress.hideAll();
		intersectLine.visible = false;
		intersectText.visible = false;
		if(!drawn.basic){
			beamMsc.applyObj(beamObj);
			drawn.basic = true;
		}
		if(!drawn.splits){
			pathG.applyObj(beamObj,splitObjs);
			drawn.splits = true;
		}
	}
	// newglobal.showGraph = steps;

	// steps(12,123);
	function beamObj(objs){ //beam objs
		applied.allobj = objs;
		drawn.basic = false;
	}//reiterate members
	thisGlobal.basicDrawOBJ = beamObj;

	function splits(obj){ //this.paths partitions 
		applied.splitObjs=obj;
		drawn.splits = false;
		// console.log(obj);
	} //adds partitions of reactions as objects
	thisGlobal.pathList = splits;
	
	function changePath(path){
		pathG.changePathActive(path);
	}
	thisGlobal.showPath = changePath;

	function modifyBase(){ //called everytime illu button pressed //don't remove
		if(applied.allobj !== undefined){
			if(applied.splitObjs !== undefined){
				steps(applied.allobj,applied.splitObjs);
			} else {
				steps(applied.allobj);
			}
		} else {
			alert('not added');
		}
	}
	thisGlobal.showGraph = modifyBase;



//dont touch here
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
				step.x = simplifiers.changeDistRate(len);
				// step.y = -force * multipliers.reactRate; //original
				step.y = -simplifiers.changeShearRate(force);
				path.lineTo(step);
				path.lastSegment.origForce = force;
			},left_con:function(force,len,mlen){
				est = (len-mlen)+(mlen/2);
				console.log(len,mlen/3,mlen,est);
				console.log('dsame',force,len,mlen); //this should b the same as *******
				fOnPoint = thisGlobal.dataCalled(est);
				console.log(est,fOnPoint);
				temp = new paper.Point(simplifiers.changeDistRate(est),-simplifiers.changeShearRate(fOnPoint.shearforce));
				step.x = simplifiers.changeDistRate(len);
				step.y = -simplifiers.changeShearRate(force);
				// path.lineTo(step);
				path.curveTo(temp,step);
				path.lastSegment.origForce = force;
			},right_con:function(force,len, mlen){
				est = (len-mlen)+(mlen/2);
				fOnPoint = thisGlobal.dataCalled(est);
				console.log(est,fOnPoint.shearforce);
				temp = new paper.Point(simplifiers.changeDistRate(est),-simplifiers.changeShearRate(fOnPoint.shearforce));
				step.x = simplifiers.changeDistRate(len);
				step.y = -simplifiers.changeShearRate(force);
				path.curveTo(temp,step);
				path.lastSegment.origForce = force;
			},c_point:function(force,len,whole){
				disWalk = vLen;
				half = whole/2;
				// console.log(whole,disWalk,half);
				tent = (disWalk - whole) + half;
				loadHelper.noload(force,tent);
				force2 = thisGlobal.dataCalled(tent);
				loadHelper.suppStep(force2.shearforce);
				loadHelper.noload(force2.shearforceb4,disWalk);
			},two_point:function(force,len,whole){
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
			//	step.x = len*multipliers.distanceRate; //original
				step.x = simplifiers.changeDistRate(len);
				force = path.lastSegment.origForce;
				path.lineTo(step);
				path.lastSegment.origForce = force;
			},suppStep:function(react){
				// step.y = -react * multipliers.reactRate;
				step.y = -simplifiers.changeShearRate(react);
				path.lineTo(step);
				path.lastSegment.origForce = react;
			}
		}

		for (var i = 0; i < applied.allobj.members.length; i++) { //iterates joints
			var walk;
			if(i==0){
				walk = thisGlobal.dataCalled(0).shearforce;
				loadHelper.suppStep(walk);
			}
			if(applied.allobj.members[i] !== undefined){
				var mlent=applied.allobj.members[i].mlength;
				// console.log(mlent,'collected from members')
				vLen += mlent;
				// console.log(mlent ,'added to vlen');
				walk = thisGlobal.dataCalled(vLen);
				// console.log('same',walk.shearforceb4,vLen,mlent); //this should b the same as *******
				loadHelper[applied.allobj.loads[i].loadtype](walk.shearforceb4,vLen,mlent);
				loadHelper.suppStep(walk.shearforce);
			}
		}

						/* check path origForce*/
		// console.log('original');
		// for (var i = 0; i < path.segments.length; i++) {
		// 	var x = path.segments[i];
		// 	console.log('origForce',x.origForce,'; origPosition', x.point.y);
		// }

		return path;
	}
}//end project

var pathGvals = { //remove later
	width:200,
}

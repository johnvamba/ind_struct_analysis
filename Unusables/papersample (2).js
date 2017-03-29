window.onload = function() {
var canvas = document.getElementById('myCanvas');
	paper.setup(canvas);
	var applied = { // if objects are present
		allobj:null,
		splits:null,
	};

	var PathGroup = function(){
		// console.log(allobj === undefined , splits === undefined);
		//pre objs
		var path = ['shearPath', 'momentPath', 'deflectPath'];
		var pathColor = ['red','green','blue'];
		var others = ['shearStress', 'bendStress'];
		var intersectLine = new paper.Path({
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
			fillColor: 'black'
		});

		//required paper objs
		var paths = new paper.Group();
		var textforces = new paper.Group();

		this.applyObj = function(allobj,splits){ //do changes/building here
			if(allobj === undefined || splits === undefined){ //does not procede if splits objs are lacking
				return;
			}

			if(paths.hasChildren() && textforces.hasChildren()){
				this.clear();
			}

			for (var i =0 ; i < path.length;i++){ //for funciton generating path
				paths.addChild(
					// new paper.Path({ //original
					new paper.Path.Rectangle({
						size:[sampvals.width,150],
						// position: paper.view.center, //puts paths center to view center
						// point: paper.view.center, //puts top left corner to center.
						name: path[i],
						strokeColor: pathColor[i],
						fillColor: pathColor[i],
						// segments:[[0,0]],
						strokeWidth:2
					})
				);
				paths.children[i].fillColor.alpha = 0.2;

				textforces.addChild(new paper.Group({
					name:path[i],
					fillColor:pathColor[i]
					// pivot:[0,0]
				}));
			}

		}
		


		// var text = new Array();

		//do here
		// console.log(paths);

		this.active;
		this.changePathActive = function(path){ //pathname
			for (var i = 0; i < paths.children.length; i++) {
				paths.children[i].visible = false;
				if (path === undefined || path === 'allPath'){
					paths.children[i].visible = true;
				} else if(paths.children[i].name === path){
					paths.children[i].visible = true;
					this.active = paths.children[i];
				}
			}
		}

		this.clear = function(){
			intersectLine.visible = false;
			intersectText.visible = false;
			this.paths.removeChildren();
			this.textforces.removeChildren();
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
			if(allobj === undefined || applied.allobj === allobj){
				return;
			}

			if(this.supports.hasChildren() && this.group.hasChildren()){
				this.clear();
			}
			
			//object creation
			this.beam = new paper.Path.Rectangle({ 
				size: [sampvals.width,10],
				point: [0,-5],
				name:'Beam',
				fillColor: 'black',
				strokeColor: 'black',
				strokeWidth:1,
				// opacity:.1
			});
			applied.allobj = allobj;
		}
		

		this.clear = function(){
			this.group.removeChildren(); //clears group
			this.beam.remove(); // remove the path
			this.supports.removeChildren(); //remove anything inside
		}
		//beam
		//supports
	} // end of MSC Object

	var mainGroup=new paper.Group();

	var Stresses = function(){
		this.show = function(){}
		this.hide = function(){}
		this.change = function(){}
	}

	mainGroup.on({
		mouseclick: function(event){
			console.log('click');
		},
		mousedrag: function(event){
			event.modifiers.d = paper.Key.isDown('d');
			console.log(this);
			if(event.modifiers.d){
				console.log('Should move');
				return;
			}
			//	console.log('click')
			console.log('drag');
		}
	});

	// steps;

	var samp,samp2;
		samp2 = new MscGroup();
		samp = new PathGroup();
	function steps(beamObj,splitObjs){ //put everything here
		samp2.applyObj(beamObj);
		samp.applyObj(beamObj,splitObjs);
	}
	newglobal.showGraph = steps;

	// steps(12,123);
	
	function changePath(path){
		samp.changePathActive(path);
	}
	newglobal.changePath = changePath;

}



var sampvals = {
	width:200,
}


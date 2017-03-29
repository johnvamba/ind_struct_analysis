var Illustrator = (function(){
	var preval = {
		margin : {
			left: 50,
			right: 50,
			top: 50,
			bottom:50
		},
		center_y:200,
		startPoint: "M15,200"
	}

	var truthVal = {
		hasModified:false,
		group:false,
		shearP:false
	}

	var data, reactions, origx, path = new PathGenerator(),
		groups = new Array(),
		svg = Snap('#illuIDSVG');
	var origx = new Array(); //origin for of each SUPPORTS/DIVIDER in relation to x-axis = [0,100,200,350] etc

	function setUpGroups(){
		$(illuGRequire).each(function(index, cName){
			groups[index] = svg.g().addClass(cName);
		});
		truthVal.group = true
	}

	function constructBeam(){
		if(!truthVal.hasModified && data === undefined) {
			showEmpty();
			return; //add later since mu bug siya.
		} else if(truthVal.hasModified){
			svg.clear();
		}
		if(!truthVal.group) setUpGroups(); //if groups hasn't set up //skips if done.
		console.log('constructing member illustration');

		var org = setUpOrigX(); //repeats if table has been modified.fixed?

		//add here
		// add separators
		$(origx).each(function(index,value){
			groups[0].add(svg
				.line(value,50,value,300)
				.attr({
					stroke:"#000",
					strokeWidth:2,
					opacity:0.1
				})
				.transform('t'+preval.margin.left+' 0')
				);
		});
				//beam
		groups[1].add(
			svg.rect(0,0,org,5)
				.attr({fill:"#bada55"})
				.transform('t'+preval.margin.left+' '+preval.center_y+'')
		); //add beam design.
		
		truthVal.hasModified = false;
	} //end construct beam

	function setUpShear(){ //set up shear diagram
		if (truthVal.shearP) return;
		if(!truthVal.group) setUpGroups();
		var p = path.getShearPath();
		console.log(p);

		groups[4].add(
			svg.path(p)
			.attr(attribList.bendStress)
		)	.transform("t"+preval.margin.left+" 200"); //shear

		truthVal.shearP = true;
	}

	function setUpOrigX(){
				//setup ORIGINS/DIVIDER
				// data.lengths.length ==sample.lengths Sample only.
		origx = new Array();
		var total=0;
		origx.push(total);
		if (data.lengths.length === 0) { 
			console.log('not added')
			return;
		}
		$(data.lengths).each(function(index, value){
			total+= distanceGen(value, 50);
			origx.push(total);
		});

		if(svg.attr('width')<total){ // bug?
			svg.attr({width: total + preval.margin.right})
		}
		console.log(origx);
		globalData.xPath = origx;
		// truthVal.origs = true;
		return total;
	}

	function distanceGen(len, multiplier){
		len = len * multiplier;
		return len;
	}

	function showEmpty(){
		svg.clear();
		svg.text(0,50,'Empty beam, missing member/elements');
	}

	return {
		initIllu:function(o){ // use global variables
			console.log('grabbed');
			console.log(o);
			data = o;
		},
		showIllu:function(tval){
			// if (!tval) {
			// 	showEmpty();
			// 	console.log('empty data');
			// 	return;
			// }
			// console.log(data);
			// console.log(svg);
			constructBeam();
		},
		addResult: function(obj){
			reactions =obj;
			//collect result
		},
		state:function(val){
			if(val===undefined)
				return truthVal.hasModified;
			truthVal.hasModified=val;
		},
		calculate:function(){
			setUpShear();
		}
	}
});

//BUG LIST!!!
/*
	1. Data Replicates on click. //resolved?
		this happens when illustration button is clicked.
			Add condition to check if new data created OR
			Reset Data collected per click. ---better
*/

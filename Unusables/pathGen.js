var PathGenerator = (function(){

	var allData,
			traPrint = 'M0 0 ',//start
			intPoints; //travel x

	var values = {
		start:"M15,200", //wrong value
		hValue:0 //highest value
	}

	var guide={ //pentravel to end
		x:0,
		y:0
	},mguide={ //pentravel to end
		x:0,
		y:0
	}

	var walk = {
		moveY:function(y){
			guide.y += y;
			return "L"+guide.x+" "+guide.y+" ";
		},
		traverse:function(m){ //function(m,x,y) m=memberdata, x=endDistanceMember, y=nextrforce
			// guide.x += x;
			return methShear[m.ltype](multiplier(m.len),m.load);
		},closePath:function(){
			return 'z';
		}
	}

	var jump = { ///////////////Change this!!!!!!!!!!!!!!!!!!
		moveY:function(y){
			guide.y += y;
			return "L"+guide.x+" "+guide.y+" ";
		},
		traverse:function(m){ //function(m,x,y) m=memberdata, x=endDistanceMember, y=nextrforce
			// guide.x += x;
			return methShear[m.ltype](multiplier(m.len),m.load);
		},closePath:function(){
			return 'z';
		}
	}

	var methShear = {
		c_point: function(l,ld){
			var path='';
			var len = (l/mul)/2;
			guide.x += len;
			path+= 'L'+guide.x+' '+guide.y+' '; //straight line to middle;
			guide.y += ld;
			path+= 'L'+guide.x+' '+guide.y+' '; //middle lowerd by load;
			guide.x += len;
			path+= 'L'+guide.x+' '+guide.y+' '; //line goes to end;
			return path;
		},two_point:function(l,ld){
			var path='';
			var len = (l/mul)/3;
			guide.x += len;
			path+= 'L'+guide.x+' '+guide.y+' '; //straight line to first;
			guide.y += ld;
			path+= 'L'+guide.x+' '+guide.y+' '; //middle lowerd by load;
			guide.x += len;
			path+= 'L'+guide.x+' '+guide.y+' '; //straight line to second;
			guide.y += ld;
			path+= 'L'+guide.x+' '+guide.y+' '; //middle lowerd by load;
			guide.x += len;
			path+= 'L'+guide.x+' '+guide.y+' '; //line goes to end;
			return path;
		},equally:function(l,ld){
			guide.x+=l;
			guide.y+=(l/mul)*ld;
			return 'L'+guide.x+' '+guide.y+' ';
		},left_con:function(l,ld){ // \
			var ePoint = (l/mul)*ld; //End point y
			var len = l/mul;	//end point x
			var aPoint = {
				x:guide.x,
				y:guide.y
			}
			var path = '';
			// path += 'C'+;
			//add something here
			return 'L'+guide.x+' '+guide.y+' '; //change
		},right_con:function(l,ld){ // /
			//add something here
			return 'L'+guide.x+' '+guide.y+' ';
		},noload:function(l,ld){
			guide.x+=l;
			return 'L'+guide.x+' '+guide.y+' ';
		}
	}
	var moment = {
		onX: function(x){

		},youngModulus:function(x){

		},getI:function(x){

		}
	}

	return {
		calibrate: function(hV){
			values.hValue = hV;
		},
		getShearPath:function(){
			console.log(globalData);
			allData = globalData;
			$(allData.reactions).each(function(index,obj){
				traPrint += walk.moveY(-obj.y);
				if(allData.reactions.length > index+1 && allData.memb[index] !== undefined)
					traPrint += walk.traverse(allData.memb[index]);
				// traPrint += walk.traverse(allData.memb[index],allData.xPath[index+1],-multiplier(allData.reactions[index+1].y));
			});
			traPrint += walk.closePath();
			return traPrint;
		},
		getMomentPath:function(){
			allData = sample;
			$(allData.reactions).each(function(index,obj){
				traPrint += jump.moveY(-obj.y);
				if(allData.reactions.length > index+1 && allData.memb[index] !== undefined)
					traPrint += jump.traverse(allData.memb[index]);
				// traPrint += jump.traverse(allData.memb[index],allData.xPath[index+1],-multiplier(allData.reactions[index+1].y));
			});
			traPrint += jump.closePath();
			return traPrint;
		},getBendingStress:function(x){
			// return moment.onX(x)/moment.youngModulus(x) * moment.getI(x);
		}
	}
});

	//path for shear diagram
		//mostly linear; curves only on slated distribution 
		/*HOW?
		get data relating: 
			Length: to evaluate the reaction direction;
			Load(for pathmethod: type and value),
			YReaction value: (+-) for position;
		Method:
			set path = m(0,0)
			for each reaction/support {
				path += apply reaction; //moveY(reaction)
				path += traverse (length, load);
			}
		*/
	//path for moment diagram
		//mostly curves; linear only on no load;
	//path for bending diagram
		//IDK. :(
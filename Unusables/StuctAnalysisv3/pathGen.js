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
	}

	var walk = {
		moveY:function(y){
			guide.y += y;
			return "L"+guide.x+" "+guide.y+" ";
		},
		traverse:function(x,y){ //function(m,x,y) m=memberdata, x=endDistanceMember, y=nextrforce
			// guide.x += x;
			guide.y += y;
			return "L"+x+" "+guide.y+" ";
		},closePath:function(){
			return 'z';
		}
	}

	var methShear = {
		c_point: function(l,ld){
			var path='';
			var len = l/2;
			guide.x += len;
			path+= 'L'+guide.x+' '+guide.y+' '; //straight line to middle;
			guide.y += ld;
			path+= 'L'+guide.x+' '+guide.y+' '; //middle lowerd by load;
			guide.x += len;
			path+= 'L'+guide.x+' '+guide.y+' '; //line goes to end;
			return path;
		},two_point:function(l,ld){
			var path='';
			var len = l/3;
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
			guide.y+=ld;
			// var path='L';
			return 'L'+guide.x+' '+guide.y+' ';
		},left_con:function(){

		},right_con:function(){

		},noload:function(l,ld){
			guide.x+=l;
			return 'L'+guide.x+' '+guide.y+' ';
		}
	}

	return {
		calibrate: function(hV){
			values.hValue = hV;
		},
		set:function(data){
			// mem.load = load;
			// mem.leng = leng;
			// mem.strt = start;
			// mem.end = end;
		},
		getShearPath:function(){
			allData = sample;
			$(allData.reactions).each(function(index,obj){
				traPrint += walk.moveY(-obj.y);
				if(allData.reactions.length > index+1)
					traPrint += walk.traverse(allData.xPath[index+1],-allData.reactions[index+1].y);
			});
			traPrint += walk.closePath();
			return traPrint;
		},getMomentPath:function(){

		},getBendingPath:function(){

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
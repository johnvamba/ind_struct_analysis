
$(document).ready(function(){
	var arr = [],
		arr2= [];

	$("#btn").click(function(){ //modify base
		console.log('Illustration');
		if(arr.length > 0 && arr2.length <= 0){ //if has data while not calculated
			newglobal.showGraph(arr);
			console.log('step1');
		} else if(arr.length<=0 && arr2.length<=0){
			console.log('do nothing cause no data');
			alert('No Objects');
			return;
		}else{
			newglobal.showGraph(arr, arr2);
			console.log('step2');
		}
		return;
	});
	
	$("#add").click(function(){
		arr.push(parseInt(Math.random()*10));
		console.log(arr,'Add, resets Illu');
	});

	$("#calc").click(function(){
		arr2.push(parseInt(Math.random()*10));
		console.log(arr2,'Calculated');
	});

	$('.graph.checkbox').checkbox({
	    onChange:function(){
	      console.log($(this).attr('data-value'));
	      newglobal.changePath($(this).attr('data-value'));
	    }
	});

});

newglobal = {
	changePath:function(path){},
	showGraph:function(obj1,obj2){}

}

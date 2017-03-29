var BeamSVG = (function(){
	var svgID, origX, origY, mar[4];
	function construct(){

	}
	//setting config
	function separator(){

	}

	return {
		// config: function(setting, arg[]){
		// 	switch (setting){
		// 		case '':
		// 		break;
		// 	}
		// 	return this;
		// }
		select: function(svgID){

		},
		setMargin:function(l,r,t,b){
			mar[0] = l;
			mar[1] = r;
			mar[2] = t;
			mar[3] = b;
		},
		setOrigin:function(x,y){

		}
	}
});

function BeamSVGObj(){
	this.start;
	this.end;
}
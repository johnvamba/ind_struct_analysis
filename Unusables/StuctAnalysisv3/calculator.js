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

function calcAreaI(a,b,c,d){
	var e = b - (2*d);
	var f = (2 * calcArea2(a,d)) + calcArea2(e,c);
	return f;
}

function calcAreaT(a,b,c,d){
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



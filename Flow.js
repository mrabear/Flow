//Wait for DOM to load before starting a game
$(window).ready(function(){ 
	init(); 
});

var DrawingContext;
var ScreenWidth,ScreenHeight;

function init(){
	//Get a handle to the 2d context of the canvas
	DrawingContext = document.getElementById('GameCanvas').getContext('2d'); 
	
	//Calulate screen height and width
	ScreenWidth = parseInt($("#GameCanvas").attr("width"));
	ScreenHeight = parseInt($("#GameCanvas").attr("height"));

	DrawingContext.fillRect(10, 20, ScreenWidth, ScreenHeight);
	//alert( ScreenHeight + " x " + ScreenWidth);
}


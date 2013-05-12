//Wait for DOM to load before starting a game
$(window).ready(function(){ 
	Initialize(); 
});

var DrawingContext;
var Canvas;

function Initialize(){

	Canvas = document.getElementById('GameCanvas');
	//Get a handle to the 2d context of the canvas
	DrawingContext = Canvas.getContext('2d'); 
	
	ResizeCanvas();

}

function ResizeCanvas()
{
	if( Canvas.width != document.width)
	{
		Canvas.width = document.width;		
	}

	if( Canvas.height != document.height)
	{
		Canvas.height = document.height;

	}
}

function Draw()
{
	ResizeCanvas();
	
	DrawingContext.fillStyle="#FF0000";
	DrawingContext.fillRect(0, 0, Canvas.width, Canvas.height);
	
	DrawingContext.fillStyle="#000000";
	DrawingContext.fillRect(10, 10, Canvas.width-20, Canvas.height-20);	
}

function ProcessFrame() {
	Draw();
}

setInterval(ProcessFrame, 30);

//Wait for DOM to load before starting a game
$(window).ready(function(){ 
	Initialize(); 
});

var DrawingContext;
var Canvas;

var GameSurfaceBounds = new Object();

var Bumpers = new Array();

function Initialize(){

    // Find the drawing canvas
	Canvas = document.getElementById('GameCanvas');

	// Get a handle to the 2d context of the canvas
	DrawingContext = Canvas.getContext('2d'); 

	// Defines important points in the game surface
	GameSurfaceBounds.TopLeft = new Object();
	GameSurfaceBounds.Center = new Object();
	
	// Resize the canvas to fit the browser window
	ResizeCanvas();

	// Build the bumpers
	BuildBumpers();
}

// Resizes the canvas to maximize it in the browser window
function ResizeCanvas()
{
	// Only resize if the window has changed 
	if(( Canvas.width != document.width) || ( Canvas.height != document.height))
	{
		// Resize the canvas to fit the window
		Canvas.width = document.width;		
		Canvas.height = document.height;

		// Resize the game surface
		GameSurfaceBounds.width = Math.round( Math.min( document.width, document.height ));
		GameSurfaceBounds.height = Math.round( GameSurfaceBounds.width * 0.75 );

		// The top left corner of the game surface
		GameSurfaceBounds.TopLeft.x = ( document.width - GameSurfaceBounds.width ) / 2;
		GameSurfaceBounds.TopLeft.y = ( document.height - GameSurfaceBounds.height ) / 2;

		// The center point of the game surface
		GameSurfaceBounds.Center.x = document.width / 2;
		GameSurfaceBounds.Center.y = document.height / 2;
	}
}

function Draw()
{
	// Resize the canvas (if the browser has been resized)
	ResizeCanvas();

	DrawBorders();

	DrawBumpers();
}

function DrawBorders()
{
	// outer border color
	DrawingContext.fillStyle="#555555";
	DrawingContext.fillRect(0, 0, Canvas.width, Canvas.height);
	
	// inner game surface color
	DrawingContext.fillStyle="#FFFFFF";
	DrawingContext.fillRect(GameSurfaceBounds.TopLeft.x, GameSurfaceBounds.TopLeft.y, GameSurfaceBounds.width, GameSurfaceBounds.height);	

	DrawingContext.font = "bold 12px sans-serif";
	DrawingContext.fillText(GameSurfaceBounds.width + " x " + GameSurfaceBounds.height, 25, 43);	
}

// Build an array of bumpers for the player to use
function BuildBumpers()
{
	Bumpers[0] = {Radius: GameSurfaceBounds.width * 0.1, StartAngle: 1 * Math.PI, EndAngle: 0 * Math.PI, Color: 'black', LineWdith: 10};
}

// Draw all of the current bumpers
function DrawBumpers()
{
	//console.log( "drawing bumpers " + Bumpers[0].Color )

    var BumperTotal = Bumpers.length;

    for( var BumperIndex = 0 ; BumperIndex < BumperTotal ; BumperIndex++ )
    {
		DrawingContext.beginPath();
		DrawingContext.arc(GameSurfaceBounds.Center.x, GameSurfaceBounds.Center.y, 
			               Bumpers[0].Radius, Bumpers[0].StartAngle, Bumpers[0].EndAngle, false);
		DrawingContext.lineWidth = Bumpers[0].LineWdith;

		// line color
		DrawingContext.strokeStyle = Bumpers[0].Color;
		DrawingContext.stroke();

		//DrawingContext.fillStyle = 'green';
		//DrawingContext.fill();
	}
}

function ProcessFrame() {
	Draw();
}

setInterval(ProcessFrame, 30);

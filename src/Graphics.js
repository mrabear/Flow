// src.Graphics.js
// Graphics libraries and drawing functions

var Graphics = 
{
	DrawingContext: {}, 
	Canvas: {},

	AspectRatio: 0.75,
	MinCanvasSize: { width: 800, height: 600},

	GameSurfaceBounds: {},

	Initialize: function(){

	    // Find the drawing canvas
		Graphics.Canvas = document.getElementById('GameCanvas');

		// Get a handle to the 2d context of the canvas
		Graphics.DrawingContext = Graphics.Canvas.getContext('2d'); 

		// Defines important points in the game surface
		Graphics.GameSurfaceBounds.TopLeft = {};
		Graphics.GameSurfaceBounds.Center = {};
		
		// Resize the canvas to fit the browser window
		Graphics.ResizeCanvas();
	},

	// Resizes the canvas to maximize it in the browser window
	ResizeCanvas: function()
	{
		// Only resize if the window has changed 
		if(( Graphics.Canvas.width != document.width) || ( Graphics.Canvas.height != document.height))
		{
			// Resize the canvas to fit the window
			Graphics.Canvas.width = Math.max( Graphics.MinCanvasSize.width, document.width );
			Graphics.Canvas.height = Math.max( Graphics.MinCanvasSize.height, document.height );

			// Resize the game surface
			Graphics.GameSurfaceBounds.width = Math.max( Graphics.MinCanvasSize.width, Math.round( Math.min( document.width, document.height )));
			Graphics.GameSurfaceBounds.height = Math.round( Graphics.GameSurfaceBounds.width * 0.75 );

			// The top left corner of the game surface
			Graphics.GameSurfaceBounds.TopLeft.x = ( document.width - Graphics.GameSurfaceBounds.width ) / 2;
			Graphics.GameSurfaceBounds.TopLeft.y = ( document.height - Graphics.GameSurfaceBounds.height ) / 2;

			// The center point of the game surface
			Graphics.GameSurfaceBounds.Center.x = document.width / 2;
			Graphics.GameSurfaceBounds.Center.y = document.height / 2;
		}
	},

	Draw: function()
	{
		// Resize the canvas (if the browser has been resized)
		Graphics.ResizeCanvas();

		Graphics.DrawBorders(Graphics.DrawingContext);

		Bumper.DrawBumpers(Graphics.DrawingContext);

		Balls.DrawBalls(Graphics.DrawingContext);

		Balls.SpawnBall();
	},

	DrawBorders: function( DrawingContext )
	{
		// outer border color
		DrawingContext.fillStyle="#555555";
		DrawingContext.fillRect(0, 0, Graphics.Canvas.width, Graphics.Canvas.height);
		
		// inner game surface color
		DrawingContext.fillStyle="#FFFFFF";
		DrawingContext.fillRect(Graphics.GameSurfaceBounds.TopLeft.x, Graphics.GameSurfaceBounds.TopLeft.y, Graphics.GameSurfaceBounds.width, Graphics.GameSurfaceBounds.height);	

		DrawingContext.font = "bold 12px sans-serif";
		DrawingContext.fillText( "Bumper Angle: " + Bumper.Angle + " (" + Input.IsMouseDown + ")", 25, 25);	
		DrawingContext.fillText( "Canvas: " + Graphics.Canvas.width + " x " + Graphics.GameSurfaceBounds.height, 25, 40);	
		DrawingContext.fillText( "GameSurface: " + Graphics.GameSurfaceBounds.width + " x " + Graphics.GameSurfaceBounds.height, 25, 55);	
	}
};
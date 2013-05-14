// src.Graphics.js
// Graphics libraries and drawing functions

var Graphics = 
{
	DrawingContext: {}, 
	Canvas: {},

	AspectRatio: 0.75,
	MinCanvasSize: { width: 800, height: 600},

	CenterPoint: { x: 0, y: 0 },
	CanvasSize: { width: 0, height: 0 },

	WindowSize: { width: 0, height: 0 },

	Initialize: function(){

	    // Find the drawing canvas
		Graphics.Canvas = document.getElementById('GameCanvas');

		// Get a handle to the 2d context of the canvas
		Graphics.DrawingContext = Graphics.Canvas.getContext('2d'); 
		
		// Resize the canvas to fit the browser window
		Graphics.ResizeCanvas();
	},

	DrawFrame: function()
	{
		// Resize the canvas (if the browser has been resized)
		Graphics.ResizeCanvas();

		Graphics.DrawBackground(Graphics.DrawingContext);

		Bumper.DrawBumpers(Graphics.DrawingContext);

		Balls.DrawBalls(Graphics.DrawingContext);

		Graphics.DrawDebugMessages(Graphics.DrawingContext);
	},

	// Resizes the canvas to maximize it in the browser window
	ResizeCanvas: function()
	{
		if(( document.width != Graphics.WindowSize.width) || ( document.height != Graphics.WindowSize.height))
		{
			console.log( "resizing ")
			Graphics.WindowSize.width  = document.width;
			Graphics.WindowSize.height = document.height;

			// Resize the game surface
			Graphics.CanvasSize.width  = Math.max( Graphics.MinCanvasSize.width, Math.round( 
													Graphics.AspectRatio * document.width <= document.height ? document.width : Math.min( document.height / Graphics.AspectRatio, document.width ) 
											   	));
			Graphics.CanvasSize.height = Math.round( Graphics.CanvasSize.width * 0.75 );

			Balls.AdjustPosition( Graphics.CanvasSize.width - Graphics.Canvas.width, Graphics.CanvasSize.height - Graphics.Canvas.height );

			Graphics.Canvas.width  = Graphics.CanvasSize.width;
			Graphics.Canvas.height = Graphics.CanvasSize.height;

			Graphics.CenterPoint.x = Math.round( Graphics.Canvas.width / 2 );
			Graphics.CenterPoint.y = Math.round( Graphics.Canvas.height / 2 );
		}
	},

	DrawBackground: function( DrawingContext )
	{
		// inner game surface color
		DrawingContext.fillStyle="#FFFFFF";
		DrawingContext.fillRect(0, 0, Graphics.Canvas.width, Graphics.Canvas.height);
	},

	DrawDebugMessages: function( DrawingContext )
	{
		DrawingContext.font = "bold 12px sans-serif";
		DrawingContext.fillText( "Bumper Angle: " + Bumper.Angle + " (" + Input.IsMouseDown + ")", 25, 25);	
		DrawingContext.fillText( "Canvas: " + Graphics.Canvas.width + " x " + Graphics.Canvas.height, 25, 40);
		DrawingContext.fillText( "Document: " + document.width + " x " + document.height, 25, 55);
	}
};
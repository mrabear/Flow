// src.Graphics.js
// Graphics libraries and drawing functions
var Graphics = 
{
	// The 2D render conext that will be used to draw graphics
	DrawingContext: {}, 

	// The HTML5 canvas that the game runs in
	Canvas: {},

	// The aspect ratio to maintain while resizing the canvas
	AspectRatio: 0.75,

	// The minimum size to maintain while resizing the canvas
	MinCanvasSize: { width: 800, height: 600},

	// The center point of the canvas
	CenterPoint: { x: 0, y: 0 },

	// The current size of the browser window (used to detect window resizing)
	WindowSize: { width: 0, height: 0 },

	// The fixed framerate of the game
	FramesPerSecond: 30,

	// Initializes the graphics objects
	Initialize: function(){

		// Find the drawing canvas
		Graphics.Canvas = document.getElementById('GameCanvas');

		// Get a handle to the 2d context of the canvas
		Graphics.DrawingContext = Graphics.Canvas.getContext('2d'); 
		
		// Resize the canvas to fit the browser window
		Graphics.ResizeCanvas();
	},

	// Renders a single frame of game graphics
	RenderFrame: function()
	{
		// Resize the canvas (if the browser has been resized)
		Graphics.ResizeCanvas();

		// Draw the background graphics
		Graphics.DrawBackground(Graphics.DrawingContext);

		// Draw the center bumpers
		Bumper.DrawBumperSegments(Graphics.DrawingContext);

		// Draw the balls and update the position of existing balls
		Balls.DrawBalls(Graphics.DrawingContext);

		// Draw any debug messages
		Graphics.DrawDebugMessages(Graphics.DrawingContext);
	},

	// Resizes the canvas to maximize it in the browser window
	ResizeCanvas: function()
	{
		// Check to see if the screen has changed since the last time it was resized
		if(( document.width != Graphics.WindowSize.width) || ( document.height != Graphics.WindowSize.height))
		{
			var CanvasSize = {};

			// Save the new screen size
			Graphics.WindowSize.width  = document.width;
			Graphics.WindowSize.height = document.height;

			// Calculate the new game surface dimensions, maximizing surface area while maintaining the aspect ratio defined by Graphics.AspectRatio
			CanvasSize.width  = Math.max( Graphics.MinCanvasSize.width, Math.round( 
											Graphics.AspectRatio * document.width <= document.height ? document.width : Math.min( document.height / Graphics.AspectRatio, document.width ) 
										));
			CanvasSize.height = Math.round( CanvasSize.width * 0.75 );

			// Translate the position of the balls so that their orientation on the resized game surface remains similar
			Balls.TranslateBallPositions( CanvasSize.width - Graphics.Canvas.width, CanvasSize.height - Graphics.Canvas.height );

			// Resize the canvas
			Graphics.Canvas.width  = CanvasSize.width;
			Graphics.Canvas.height = CanvasSize.height;

			// Calculate the new canvas center point
			Graphics.CenterPoint.x = Math.round( Graphics.Canvas.width / 2 );
			Graphics.CenterPoint.y = Math.round( Graphics.Canvas.height / 2 );
		}
	},

	// Draw the background images
	DrawBackground: function( DrawingContext )
	{
		// inner game surface color
		DrawingContext.fillStyle="#FFFFFF";
		DrawingContext.fillRect(0, 0, Graphics.Canvas.width, Graphics.Canvas.height);
	},

	// Draw debug messages
	DrawDebugMessages: function( DrawingContext )
	{
		DrawingContext.font = "bold 12px sans-serif";
		DrawingContext.fillText( "Bumper Angle: " + Bumper.Angle + " (" + Input.IsMouseDown + ")", 25, 25);	
		DrawingContext.fillText( "Canvas: " + Graphics.Canvas.width + " x " + Graphics.Canvas.height, 25, 40);
		DrawingContext.fillText( "Document: " + document.width + " x " + document.height, 25, 55);
	}
};
// src.graphics.js
// Graphics libraries and drawing functions
var graphics = {
	// The 2D render conext that will be used to draw graphics
	drawingContext: {},

	// The HTML5 canvas that the game runs in
	canvas: {},

	// The aspect ratio to maintain while resizing the canvas
	aspectRatio: 0.75,

	// The minimum size to maintain while resizing the canvas
	minCanvasSize: {
		width: 800,
		height: 600
	},

	// The center point of the canvas
	centerPoint: {
		x: 0,
		y: 0
	},

	// The current size of the browser window (used to detect window resizing)
	windowSize: {
		width: 0,
		height: 0
	},

	// Initializes the graphics objects
	Initialize: function() {

		// Find the drawing canvas
		graphics.canvas = document.getElementById('GameCanvas');

		// Get a handle to the 2d context of the canvas
		graphics.drawingContext = graphics.canvas.getContext('2d');

		// Resize the canvas to fit the browser window
		graphics.ResizeCanvas();
	},

	// Renders a single frame of game graphics
	RenderFrame: function() {
		// Resize the canvas (if the browser has been resized)
		graphics.ResizeCanvas();

		// Draw the background graphics
		//graphics.DrawBackground(graphics.drawingContext);

		// Draw the center bumpers
		bumper.DrawBumperSegments(graphics.drawingContext);

		// Draw the balls and update the position of existing balls
		ballManager.DrawBalls(graphics.drawingContext);

		// Draw any debug messages
		graphics.DrawDebugMessages(graphics.drawingContext);
	},

	// Resizes the canvas to maximize it in the browser window
	ResizeCanvas: function() {
		// Check to see if the screen has changed since the last time it was resized
		if ((document.width != graphics.windowSize.width) || (document.height != graphics.windowSize.height)) {
			var canvasSize = {};

			// Save the new screen size
			graphics.windowSize.width = document.width;
			graphics.windowSize.height = document.height;

			// Calculate the new game surface dimensions, maximizing surface area while maintaining the aspect ratio defined by graphics.aspectRatio
			canvasSize.width = Math.max(graphics.minCanvasSize.width, Math.round(
			graphics.aspectRatio * document.width <= document.height ? document.width : Math.min(document.height / graphics.aspectRatio, document.width)));
			canvasSize.height = Math.round(canvasSize.width * 0.75);

			// Translate the position of the balls so that their orientation on the resized game surface remains similar
			ballManager.TranslateBallPositions(canvasSize.width - graphics.canvas.width, canvasSize.height - graphics.canvas.height);

			// Resize the canvas
			graphics.canvas.width = canvasSize.width;
			graphics.canvas.height = canvasSize.height;

			// Calculate the new canvas center point
			graphics.centerPoint.x = Math.round(graphics.canvas.width / 2);
			graphics.centerPoint.y = Math.round(graphics.canvas.height / 2);
		}
	},

	// Draw the background images
	DrawBackground: function(drawingContext) {
		// inner game surface color
		drawingContext.fillStyle = "#FFFFFF";
		drawingContext.fillRect(0, 0, graphics.canvas.width, graphics.canvas.height);
	},

	// Draw debug messages
	DrawDebugMessages: function(drawingContext) {
		drawingContext.font = "bold 12px sans-serif";
		drawingContext.fillStyle = "#000000";
		drawingContext.fillText("Bumper Angle: " + bumper.angle + " (" + input.isMouseDown + ")", 10, 15);
		drawingContext.fillText("Canvas: " + graphics.canvas.width + " x " + graphics.canvas.height, 10, 30);
		drawingContext.fillText("Document: " + document.width + " x " + document.height, 10, 45);
		drawingContext.fillText("Active Physics Objects: " + physics.world.GetBodyCount(), 10, 60);
	}
};
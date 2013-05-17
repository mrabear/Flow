// src.graphics.js

// Class: graphics
// Graphics libraries and drawing functions
var graphics = {
	// The 2D render conext that will be used to draw graphics
	drawingContext: {},

	// The HTML5 canvas that the game runs in
	canvas: {},

	// The aspect ratio to maintain while resizing the canvas
	aspectRatio: 1,

	// The minimum size to maintain while resizing the canvas
	minCanvasSize: {
		width: 600,
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

	colorList: ["#FF0000", "#000000"],

	// Set to true to visualize the physics entities
	visualizePhysics: false,

	// Set to true to visualize the physics entities
	showDebugInfo: true,

	// The alpha channel to use for drawing shapes
	alphaChannel: 1,

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

		// Clear the canvas
		graphics.ClearCanvas(graphics.drawingContext);

		// If the visualizePhysics flag is set, overwrite the canvas with the current physics simulation state (used to debug physics events)
		if (graphics.visualizePhysics) {
			graphics.drawingContext.globalAlpha = 1;
			physics.world.DrawDebugData();
		}

		// Switch the alpha channel of the canvas
		// (will dim the subsequent graphics to allow the physics visualization to bleed through)
		graphics.drawingContext.globalAlpha = graphics.alphaChannel;

		// Draw the center bumpers
		bumper.DrawBumperSegments(graphics.drawingContext);

		for (var currentEntity in entityManager.entities) {
			if (entityManager.GetEntity(currentEntity).type == entityManager.types.ball) {
				// Draw the balls and update the position of existing balls
				//ballManager.DrawBalls(graphics.drawingContext);
				entityManager.GetEntity(currentEntity).graphicsDef.Draw(graphics.drawingContext);
			}
		}

		// Draw any debug messages
		if (graphics.showDebugInfo) {
			graphics.DrawDebugMessages(graphics.drawingContext);
		}
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
			canvasSize.height = Math.round(canvasSize.width * graphics.aspectRatio);

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
	ClearCanvas: function(drawingContext) {
		// inner game surface color
		drawingContext.clearRect(0, 0, graphics.canvas.width, graphics.canvas.height);
	},

	// Draw debug messages
	DrawDebugMessages: function(drawingContext) {
		graphics.drawingContext.globalAlpha = 1;
		drawingContext.font = "bold 12px sans-serif";
		drawingContext.fillStyle = "#000000";
		drawingContext.fillText("Bumper Angle: " + Math.round(bumper.angle * 100) / 100 + " (" + input.isMouseDown + ")", 10, 15);
		drawingContext.fillText("Canvas: " + graphics.canvas.width + " x " + graphics.canvas.height, 10, 30);
		drawingContext.fillText("Document: " + document.width + " x " + document.height, 10, 45);
		drawingContext.fillText("Active Physics Objects: " + physics.world.GetBodyCount(), 10, 60);

		drawingContext.lineWidth = 3;
		drawingContext.strokeStyle = "#000000";
		drawingContext.strokeRect(graphics.canvas.width - 85, 10, 75, 20);
		drawingContext.fillText("Physics Viz", graphics.canvas.width - 80, 25);
	},

	// Select a random color from the list of valid colors
	GetRandomColor: function() {
		return (graphics.colorList[Math.floor(Math.random() * graphics.colorList.length)]);
	},

	// Toggle the physics visualization and adjust the global alpha channel accordingly
	TogglePhysicsVisualization: function() {
		// Toggle the physics visualization
		graphics.visualizePhysics = !graphics.visualizePhysics;

		// Dim the graphics if the physics visualizations are active
		if (graphics.visualizePhysics) {
			graphics.alphaChannel = 0.3;
			// Restore the graphics opacity if there are no visualizations
		} else {
			graphics.alphaChannel = 1;
		}
	}
};
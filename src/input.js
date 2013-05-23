// src.input.js
// Class: input
// Handles mouse and touch input
var input = {
	// The current position of the mouse (used to track mouse position changes while dragging)
	mousePosition: {
		x: 0,
		y: 0
	},

	// Set to true if a mouse button is currently held down
	isMouseDown: false,

	// Initializes the mouse and touch input handlers
	Initialize: function() {
		graphics.canvas.addEventListener("mousedown", input.MouseDown, false);
		graphics.canvas.addEventListener("mousemove", input.MouseMove, true);
		//GameCanvas.addEventListener("touchstart", TouchDown, false);
		//GameCanvas.addEventListener("touchmove", TouchXY, true);
		//GameCanvas.addEventListener("touchend", TouchUp, false);

		document.body.addEventListener("mouseup", input.MouseUp, false);
		//document.body.addEventListener("touchcancel", touchUp, false);
	},

	// Called when the left mouse button is pushed
	MouseDown: function(eventData) {
		// The mouse button is down
		input.isMouseDown = true;

		// Update the current position of the mouse (in case the user starts dragging)
		input.mousePosition = input.GetCanvasMouseCoords(eventData);

		if ((input.mousePosition.x >= graphics.canvas.width - 85) && (input.mousePosition.x <= graphics.canvas.width - 10) && (input.mousePosition.y >= 10) && (input.mousePosition.y <= 30)) {
			graphics.TogglePhysicsVisualization();
		}
	},

	// Called when the mouse is moved
	MouseMove: function(eventData) {
		// If the mouse is moving and the button is down, the user is dragging
		if (input.isMouseDown) {
			var newMousePosition = input.GetCanvasMouseCoords(eventData);

			// Move the bumper origin angle backwards or forwards depending on the direction of the mouse drag
			bumperManager.UpdateOriginAngle(input.mousePosition.x - newMousePosition.x);

			// Update the position of the mouse
			input.mousePosition = newMousePosition;
		}
	},

	// Called when the left mouse button is released
	MouseUp: function(eventData) {
		// The mouse button is released
		input.isMouseDown = false;
	},

	// Convert the mouse click event data into local canvas coordinates
	GetCanvasMouseCoords: function(eventData) {
		// Get the bounding rectangle of the game canvas
		var canvasBounds = graphics.canvas.getBoundingClientRect();

		// Return the local canvas coordinates
		return {
			x: eventData.clientX - canvasBounds.left,
			y: eventData.clientY - canvasBounds.top
		};
	}
};
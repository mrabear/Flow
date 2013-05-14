// src.Input.js
// Handles mouse and touch input
var Input = 
{
	// The current position of the mouse (used to track mouse position changes while dragging)
	MousePosition: {x: 0, y: 0},

	// Set to true if a mouse button is currently held down
	IsMouseDown: false,

	// Initializes the mouse and touch input handlers
	Initialize: function()
	{
		Graphics.Canvas.addEventListener("mousedown", Input.MouseDown, false);
		Graphics.Canvas.addEventListener("mousemove", Input.MouseMove, true);
		//GameCanvas.addEventListener("touchstart", TouchDown, false);
		//GameCanvas.addEventListener("touchmove", TouchXY, true);
		//GameCanvas.addEventListener("touchend", TouchUp, false);

		document.body.addEventListener("mouseup", Input.MouseUp, false);
		//document.body.addEventListener("touchcancel", touchUp, false);
	},

	// Called when the left mouse button is pushed
	MouseDown: function(e)
	{	
		// Identify the left mouse button as current down
		Input.IsMouseDown = true;

		// Update the current position of the mouse (in case the user starts dragging)
		Input.MousePosition = { x: e.pageX, y: e.pageY };
	},

	// Called when the mouse is moved
	MouseMove: function(e)
	{
		// If the mouse is moving and the button is down, the user is dragging
		if( Input.IsMouseDown )
		{
			// Move the bumper origin angle backwards or forwards depending on the direction of the mouse drag
			Bumper.Angle = Bumper.Angle + ( Input.MousePosition.x - e.pageX ) * ( 1 / 250);

			// If the bumper origin angle hits either 0*pi (~0 degrees) or 2*pi (~360 degrees), flip it around 
			// (this lets the bumper continually spin as the player drags)
			if( Bumper.Angle > 2 )
				Bumper.Angle = 0;
			else if( Bumper.Angle < 0 )
				Bumper.Angle = 2;

			// Update the position of the mouse
			Input.MousePosition = { x: e.pageX, y: e.pageY };
		}
	},

	// Called when the left mouse button is released
	MouseUp: function(e)
	{
		// Identify the left mouse button as not down anymore
		Input.IsMouseDown = false;
	}
};
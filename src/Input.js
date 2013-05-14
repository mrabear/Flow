// src.Input.js
// Handles mouse and touch input

var Input = 
{
	MouseXY: {x: 0, y: 0},
	IsMouseDown: false,

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

	MouseDown: function(e)
	{
		Input.IsMouseDown = true;
		Input.MouseXY.x = e.pageX;
		Input.MouseXY.y = e.pageY;
		console.log( Input.IsMouseDown + "| Mouse Down at " + Input.MouseXY.x + "," + Input.MouseXY.y );
	},

	MouseMove: function(e)
	{
		if( Input.IsMouseDown )
		{
			Bumper.Angle = Bumper.Angle + ( Input.MouseXY.x - e.pageX ) * ( 1 / 250);

			if( Bumper.Angle > 2 )
				Bumper.Angle = 0;
			else if( Bumper.Angle < 0 )
				Bumper.Angle = 2;

			Input.MouseXY.x = e.pageX;
			Input.MouseXY.y = e.pageY;
		}
	},

	MouseUp: function(e)
	{
		Input.IsMouseDown = false;
	}
};
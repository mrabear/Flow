// src.Bumper.js
// The bumper at the center of the screen, controlled by the player
var Bumper = {

	// The list of all active bumpers
	Segments: [],

	// The bumper orientation angle
	Angle: 0,

	// Builds the bumper objects and readies them for the game
	Initialize: function()
	{

		Bumper.BuildBumperSegments();
	},

	// Build an array of bumpers for the player to use
	BuildBumperSegments: function()
	{
		Bumper.Segments[0] = {Length: 0.2, Offset: 0.25, Color: "#000000", LineWdith: 10};
		Bumper.Segments[1] = {Length: 0.2, Offset: 0.75, Color: "#FF0000", LineWdith: 10};
		Bumper.Segments[2] = {Length: 0.2, Offset: 1.50, Color: "#000000", LineWdith: 10};
		Bumper.Segments[3] = {Length: 0.2, Offset: 1.75, Color: "#FF0000", LineWdith: 10};
	},

	// Draw all of the current bumpers
	DrawBumperSegments: function( DrawingContext )
	{
		// The total number of bumpers to draw (used in the for loop, cached in a var for performance reasons)
		var BumperTotal = Bumper.Segments.length;

		// The start and end angles for each bumper segment
		var StartAngle, EndAngle;

		// Loop through each bumper segment, calculate it's position, and draw it
		for( var BumperIndex = 0 ; BumperIndex < BumperTotal ; BumperIndex++ )
		{
			// Calculate the starting angle of the bumper segment
			StartAngle = Bumper.Angle + Bumper.Segments[BumperIndex].Offset;
			if( StartAngle > 2 )
				StartAngle = StartAngle % 2;

			// Calculate the ending angle of the bumper segment
			EndAngle = Bumper.Angle + Bumper.Segments[BumperIndex].Length + Bumper.Segments[BumperIndex].Offset;
			if( EndAngle > 2 )
				EndAngle = EndAngle % 2;

			// Open the canvas for drawing
			DrawingContext.beginPath();

			// Define the bumper segment based off of the previous calculations
			DrawingContext.arc( Graphics.CenterPoint.x, 
								Graphics.CenterPoint.y, 
								Graphics.Canvas.width * 0.1,
								StartAngle * Math.PI , 
								EndAngle * Math.PI, false);

			// Set the width and color of the bumper segment
			DrawingContext.lineWidth = Bumper.Segments[BumperIndex].LineWdith;
			DrawingContext.strokeStyle = Bumper.Segments[BumperIndex].Color;

			// Draw the bumper segment
			DrawingContext.stroke();
		}
	}
};
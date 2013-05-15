// src.bumper.js
// The bumper at the center of the screen, controlled by the player
var bumper = {

	// The list of all active bumper segments
	segments: [],

	// The bumper orientation angle
	angle: 0,

	// Builds the bumper objects and readies them for the game
	Initialize: function() {

		bumper.BuildBumperSegments();
	},

	// Build an array of bumpers for the player to use
	BuildBumperSegments: function() {
		bumper.segments[0] = {
			length: 0.2,
			offset: 0.25,
			color: "#000000",
			lineWdith: 10
		};
		bumper.segments[1] = {
			length: 0.2,
			offset: 0.75,
			color: "#FF0000",
			lineWdith: 10
		};
		bumper.segments[2] = {
			length: 0.2,
			offset: 1.50,
			color: "#000000",
			lineWdith: 10
		};
		bumper.segments[3] = {
			length: 0.2,
			offset: 1.75,
			color: "#FF0000",
			lineWdith: 10
		};
	},

	// Draw all of the current bumpers
	DrawBumperSegments: function(drawingContext) {
		// The total number of bumpers to draw (used in the for loop, cached in a var for performance reasons)
		var bumperTotal = bumper.segments.length;

		// The start and end angles for each bumper segment
		var startAngle, endAngle;

		// Loop through each bumper segment, calculate it's position, and draw it
		for (var bumperIndex = 0; bumperIndex < bumperTotal; bumperIndex++) {
			// Calculate the starting angle of the bumper segment
			startAngle = bumper.angle + bumper.segments[bumperIndex].offset;
			if (startAngle > 2) startAngle = startAngle % 2;

			// Calculate the ending angle of the bumper segment
			endAngle = bumper.angle + bumper.segments[bumperIndex].length + bumper.segments[bumperIndex].offset;
			if (endAngle > 2) endAngle = endAngle % 2;

			// Open the canvas for drawing
			drawingContext.beginPath();

			// Define the bumper segment based off of the previous calculations
			drawingContext.arc(graphics.centerPoint.x,
			graphics.centerPoint.y,
			graphics.canvas.width * 0.1,
			startAngle * Math.PI,
			endAngle * Math.PI, false);

			// Set the width and color of the bumper segment
			drawingContext.lineWidth = bumper.segments[bumperIndex].lineWdith;
			drawingContext.strokeStyle = bumper.segments[bumperIndex].color;

			// Draw the bumper segment
			drawingContext.stroke();
		}
	}
};
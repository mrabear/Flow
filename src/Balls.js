// src.Balls.js
// The collection of balls that spawn randomly and try to attack the player
var Balls = {
	// The list of ball instances
	Instances: [],

	// The probability that a particular frame will spawn a ball
	SpawnProbability: 0.05,

	// Attempts to spawn a ball (will be successfull at Balls.SpawnProbability rate)
	SpawnBall: function() {
		// Spawn a ball if the random number generator gets a hit
		if (Math.floor(Math.random() * Graphics.FramesPerSecond) < Math.max(1, Graphics.FramesPerSecond * Balls.SpawnProbability)) {
			// Pick a random angle (relative to the center) to spawn the ball at
			var Angle = Math.random() * 360;

			// Calculate the distance away (relative to the center at the 'Angle') that the ball needs to be spawned at
			var Radius = Math.max(Graphics.CenterPoint.x, Graphics.CenterPoint.y) + 30;

			// Create a new instance of the ball, at the point in space 'Radius' distance away at 'Angle' angle
			Balls.Instances.push({
				x: Graphics.CenterPoint.x + Radius * Math.cos(Angle),
				y: Graphics.CenterPoint.y + Radius * Math.sin(Angle),
				Angle: Math.abs(180 - Angle),
				Speed: Math.floor(Math.random() * 3),
				Color: "#000000"
			});
		}
	},

	// Update the position of and draw all of the currently active balls
	DrawBalls: function(DrawingContext) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var BallTotal = Balls.Instances.length;

		// Loop through each active ball, update it's position, and draw it
		for (var CurrentBall = 0; CurrentBall < BallTotal; CurrentBall++) {
			// Open the canvas for drawing
			DrawingContext.beginPath();

			// Update the position of the ball
			Balls.Instances[CurrentBall].x = Balls.Instances[CurrentBall].x + Balls.Instances[CurrentBall].Speed * Math.cos(Balls.Instances[CurrentBall].Angle);
			Balls.Instances[CurrentBall].y = Balls.Instances[CurrentBall].y + Balls.Instances[CurrentBall].Speed * Math.sin(Balls.Instances[CurrentBall].Angle);

			// Draw the ball onto the screen
			DrawingContext.arc(Balls.Instances[CurrentBall].x,
			Balls.Instances[CurrentBall].y,
			Graphics.Canvas.width * 0.01,
			0 * Math.PI,
			2 * Math.PI, false);


			// Set the line width and color
			DrawingContext.lineWidth = 3;
			DrawingContext.strokeStyle = "#000000";

			// Draw the ball
			DrawingContext.stroke();

			// Set the fill color of the ball
			DrawingContext.fillStyle = Balls.Instances[CurrentBall].Color;

			// Fill the ball color
			DrawingContext.fill();
		}
	},

	// Called when the canvas is resized, adjusts the position of every active ball 
	// so that the game board feels similar to the player
	TranslateBallPositions: function(XOffset, YOffset) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var BallTotal = Balls.Instances.length;

		// Loop through each ball and update it's position
		for (var CurrentBall = 0; CurrentBall < BallTotal; CurrentBall++) {
			// If the ball is past the center X point, translate X position by XOffset
			if (Balls.Instances[CurrentBall].x > Graphics.CenterPoint.x) Balls.Instances[CurrentBall].x += XOffset;

			// If the ball is past the center Y point, translate Y position by YOffset
			if (Balls.Instances[CurrentBall].y > Graphics.CenterPoint.y) Balls.Instances[CurrentBall].y += YOffset;
		}
	}
};
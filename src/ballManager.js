// src.ballManager.js
// The collection of balls that spawn randomly and try to attack the player
var ballManager = {
	// The list of ball instances
	activeBalls: [],

	// The probability that a particular frame will spawn a ball
	spawnProbability: 0.05,

	// Attempts to spawn a ball (will be successfull at ballManager.SpawnProbability rate)
	SpawnBall: function() {
		// Spawn a ball if the random number generator gets a hit
		if (Math.random() < ballManager.spawnProbability) {
			// Pick a random angle (relative to the center) to spawn the ball at
			var angle = Math.random() * 360;

			// Calculate the distance away (relative to the center at the 'Angle') that the ball needs to be spawned at
			var radius = Math.max(graphics.centerPoint.x, graphics.centerPoint.y) + 30;

			// Create a new instance of the ball, at the point in space 'Radius' distance away at 'Angle' angle
			var newBall = new ball(ballManager.activeBalls.length + 1,
			graphics.centerPoint.x + radius * Math.cos(angle), graphics.centerPoint.y + radius * Math.sin(angle), 20, "#000000");

			physics.ApplyImpulseToBody(newBall.body, Math.random() * 3 + 13, Math.abs(180 - angle));

			ballManager.activeBalls.push(newBall);
		}
	},

	// Update the position of and draw all of the currently active balls
	DrawBalls: function(drawingContext) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var ballTotal = ballManager.activeBalls.length;

		// Loop through each active ball, update it's position, and draw it
		for (var currentBall = 0; currentBall < ballTotal; currentBall++) {
			ballManager.activeBalls[currentBall].draw(drawingContext);
		}
	},

	// Called when the canvas is resized, adjusts the position of every active ball 
	// so that the game board feels similar to the player
	TranslateBallPositions: function(XOffset, YOffset) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var ballTotal = ballManager.activeBalls.length;

		// Loop through each ball and update it's position
		for (var currentBall = 0; currentBall < ballTotal; currentBall++) {
			// If the ball is past the center X point, translate X position by XOffset
			if (ballManager.activeBalls[currentBall].x > graphics.CenterPoint.x) ballManager.activeBalls[currentBall].x += XOffset;

			// If the ball is past the center Y point, translate Y position by YOffset
			if (ballManager.activeBalls[currentBall].y > graphics.CenterPoint.y) ballManager.activeBalls[currentBall].y += YOffset;
		}
	}
};
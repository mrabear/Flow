// src.ballManager.js
// The collection of balls that spawn randomly and try to attack the player
var ballManager = {
	// The list of ball instances
	instances: [],

	// The probability that a particular frame will spawn a ball
	spawnProbability: 0.05,

	ball: function(id, x, y, angle, center, color) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.angle = angle || 0;
		this.center = center;
		this.color = color || "red";
	},

	// Attempts to spawn a ball (will be successfull at ballManager.SpawnProbability rate)
	Spawn: function() {
		// Spawn a ball if the random number generator gets a hit
		if (Math.random() < ballManager.spawnProbability) {
			// Pick a random angle (relative to the center) to spawn the ball at
			var angle = Math.random() * 360;

			// Calculate the distance away (relative to the center at the 'Angle') that the ball needs to be spawned at
			var radius = Math.max(graphics.centerPoint.x, graphics.centerPoint.y) + 30;

			// Create a new instance of the ball, at the point in space 'Radius' distance away at 'Angle' angle
			ballManager.instances.push({
				x: graphics.centerPoint.x + radius * Math.cos(angle),
				y: graphics.centerPoint.y + radius * Math.sin(angle),
				angle: Math.abs(180 - angle),
				speed: Math.floor(Math.random() * 3),
				color: "#000000"
			});

			CreateBallPhysicsBody(x, y, radius, power, angle)
		}
	},

	// Update the position of and draw all of the currently active balls
	DrawBalls: function(drawingContext) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var ballTotal = ballManager.instances.length;

		// Loop through each active ball, update it's position, and draw it
		for (var currentBall = 0; currentBall < ballTotal; currentBall++) {
			// Open the canvas for drawing
			drawingContext.beginPath();

			// Update the position of the ball
			ballManager.instances[currentBall].x = ballManager.instances[currentBall].x + ballManager.instances[currentBall].speed * Math.cos(ballManager.instances[currentBall].angle);
			ballManager.instances[currentBall].y = ballManager.instances[currentBall].y + ballManager.instances[currentBall].speed * Math.sin(ballManager.instances[currentBall].angle);

			// Draw the ball onto the screen
			drawingContext.arc(ballManager.instances[currentBall].x,
			ballManager.instances[currentBall].y,
			graphics.canvas.width * 0.01,
			0 * Math.PI,
			2 * Math.PI, false);

			// Set the line width and color
			drawingContext.lineWidth = 3;
			drawingContext.strokeStyle = "#000000";

			// Draw the ball
			drawingContext.stroke();

			// Set the fill color of the ball
			drawingContext.fillStyle = ballManager.instances[currentBall].Color;

			// Fill the ball color
			drawingContext.fill();
		}
	},

	// Called when the canvas is resized, adjusts the position of every active ball 
	// so that the game board feels similar to the player
	TranslateBallPositions: function(XOffset, YOffset) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var ballTotal = ballManager.instances.length;

		// Loop through each ball and update it's position
		for (var currentBall = 0; currentBall < ballTotal; currentBall++) {
			// If the ball is past the center X point, translate X position by XOffset
			if (ballManager.instances[currentBall].x > graphics.CenterPoint.x) ballManager.instances[currentBall].x += XOffset;

			// If the ball is past the center Y point, translate Y position by YOffset
			if (ballManager.instances[currentBall].y > graphics.CenterPoint.y) ballManager.instances[currentBall].y += YOffset;
		}
	}
};
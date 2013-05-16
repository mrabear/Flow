// src.ballManager.js
// The collection of balls that spawn randomly and try to attack the player
var ballManager = {
	// The list of ball instances
	//activeBalls: [],

	// The probability that a particular frame will spawn a ball
	spawnProbability: 0.25,

	// The minimum ball width
	minBallWidth: 10,

	// The maximum ball width
	maxBallWidth: 20,

	// The amount of drift allowed in the trajectory of the balls
	targetingDrift: 0.1,

	// Attempts to spawn a ball (will be successfull at ballManager.SpawnProbability rate)
	SpawnBall: function() {
		// Spawn a ball if the random number generator gets a hit
		if (Math.random() < ballManager.spawnProbability) {
			// Pick a random spawn point for the ball
			var spawnLocation = ballManager.GetRandomSpawnPoint();

			// Calculate the angle from the spawn point to the bumper in the center
			var angleToCenter = physics.AngleToTarget({
				x: spawnLocation.x,
				y: spawnLocation.y
			}, {
				x: graphics.centerPoint.x,
				y: graphics.centerPoint.y
			})

			// Add some drift to the angle, adds some variety in the motion of the balls
			angleToCenter += angleToCenter * ballManager.targetingDrift * ((Math.random() * 2) - 1);

			// Randomly calculate a ball width, prevents the balls from looking too uniform
			var ballWidth = Math.random() * (ballManager.maxBallWidth - ballManager.minBallWidth) + ballManager.minBallWidth;

			// Create a new instance of the ball, at the point in space 'Radius' distance away at 'Angle' angle
			var newBall = new ball(entityManager.types.ball, spawnLocation.x, spawnLocation.y, ballWidth, graphics.GetRandomColor(), angleToCenter);

			// Add the ball to the active list
			//ballManager.activeBalls.push(newBall);
			var entityID = entityManager.AddEntity(entityManager.types.ball, newBall.CreatePhysicsBody(), newBall);

			// Nudge the ball toward the center
			physics.ApplyImpulseToBody(entityManager.entities[entityID].physicsBody, Math.random() * 3 + 2, angleToCenter);
		}
	},

	// Update the position of and draw all of the currently active balls
	/*DrawBalls: function(drawingContext) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		var ballTotal = ballManager.activeBalls.length;

		// Loop through each active ball, update it's position, and draw it
		for (var currentBall = 0; currentBall < ballTotal; currentBall++) {
			ballManager.activeBalls[currentBall].draw(drawingContext);
		}
	},*/

	// Called when the canvas is resized, adjusts the position of every active ball 
	// so that the game board feels similar to the player
	TranslateBallPositions: function(XOffset, YOffset) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		//var ballTotal = ballManager.activeBalls.length;
		var ballCanvasPosition = {};

		// Loop through each ball and update it's position
		for (var currentEntity in entityManager.entities) {
			if (currentEntity.type = entityManager.types.ball) {
				ballCanvasPosition = physics.GetBodyCanvasPosition(currentEntity.physicsBody);

				// If the ball is past the center X point, translate X position by XOffset
				if (ballCanvasPosition.x > graphics.centerPoint.x) ballCanvasPosition.x += XOffset;

				// If the ball is past the center Y point, translate Y position by YOffset
				if (ballCanvasPosition.y > graphics.centerPoint.y) ballCanvasPosition.y += YOffset;

				// Update the ball location
				physics.SetBodyCanvasPosition(currentEntity.physicsBody, ballCanvasPosition);
			}
		}
	},

	// Calculates a random spawn point for a ball
	// Legal spawn points are just off of the borders of the canvas on all four sides
	GetRandomSpawnPoint: function() {
		var edgeSelector = Math.floor(Math.random() * 4);
		var spawnOffset = 0;

		// Top border spawn
		if (edgeSelector == 3) {
			return ({
				x: Math.random() * graphics.canvas.width,
				y: -1 * ballManager.maxBallWidth + spawnOffset
			});
			// Right border spawn
		} else if (edgeSelector == 2) {
			return ({
				x: graphics.canvas.width + ballManager.maxBallWidth - spawnOffset,
				y: Math.random() * graphics.canvas.height
			});
			// Bottom border spawn
		} else if (edgeSelector == 1) {
			return ({
				x: Math.random() * graphics.canvas.width,
				y: graphics.canvas.height + ballManager.maxBallWidth - spawnOffset
			});
			// Left border spawn
		} else {
			return ({
				x: -1 * ballManager.maxBallWidth + spawnOffset,
				y: Math.random() * graphics.canvas.height
			});
		}
	}
};
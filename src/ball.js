// src.ball.js
// A single instance of an attacking ball

function ball(x, y, radius, color, angle) {
	this.x = x;
	this.y = y;
	this.radius = radius || ballManager.minBallWidth;
	this.color = color || "red";
	this.angle = angle || 0;
};

// Create the physics body for this ball
ball.prototype.CreatePhysicsBody = function() {
	// Create the body definition
	var bodyDefinition = new b2BodyDef;
	bodyDefinition.type = b2Body.b2_dynamicBody;
	bodyDefinition.position.x = this.x / physics.scale;
	bodyDefinition.position.y = this.y / physics.scale;
	bodyDefinition.angle = this.angle;

	// Create a physics body out of the definition
	var body = physics.world.CreateBody(bodyDefinition);

	// Apply a circular bounding box to the body (used for hit detection)
	physics.standardFixture.shape = new b2CircleShape(this.radius / physics.scale);
	body.CreateFixture(physics.standardFixture);

	// Return the newly created physics body
	return (body);
};

// Draws the ball onto the canvas
ball.prototype.Draw = function(drawingContext) {
	// Open the canvas for drawing
	drawingContext.beginPath();

	// Update the position of the ball
	this.x = entityManager.GetEntity(this.id).physicsBody.GetPosition().x * physics.scale;
	this.y = entityManager.GetEntity(this.id).physicsBody.GetPosition().y * physics.scale;

	// Draw the ball onto the screen
	drawingContext.arc(this.x, this.y, this.radius, 0 * Math.PI, 2 * Math.PI, false);

	// Set the line width and color
	drawingContext.lineWidth = 3;
	drawingContext.strokeStyle = "#000000";

	// Draw the ball
	drawingContext.stroke();

	// Set the fill color of the ball
	drawingContext.fillStyle = this.color;

	// Fill the ball color
	drawingContext.fill();
}

// ballManager
// Methods used to manage the balls
var ballManager = {
	// The probability that a particular frame will spawn a ball
	spawnProbability: 0.05,

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
			var newBall = new ball(spawnLocation.x, spawnLocation.y, ballWidth, graphics.GetRandomColor(), angleToCenter);

			// Add the ball to the active list
			//ballManager.activeBalls.push(newBall);
			var entityID = entityManager.AddEntity(entityManager.types.ball, newBall.CreatePhysicsBody(), newBall);

			// Nudge the ball toward the center
			physics.ApplyImpulseToBody(entityManager.GetEntity(entityID).physicsBody, Math.random() * 3 + 2, angleToCenter);
		}
	},

	// Called when the canvas is resized, adjusts the position of every active ball 
	// so that the game board feels similar to the player
	TranslateBallPositions: function(XOffset, YOffset) {
		// The toal number of active balls (used for the for loop, cached in a var for performance reasons)
		//var ballTotal = ballManager.activeBalls.length;
		var ballCanvasPosition = {};

		// Loop through each ball and update it's position
		for (var currentEntity in entityManager.entities) {
			if (entityManager.GetEntity(currentEntity).type == entityManager.types.ball) {
				ballCanvasPosition = physics.GetBodyCanvasPosition(entityManager.GetEntity(currentEntity).physicsBody);

				// If the ball is past the center X point, translate X position by XOffset
				if (ballCanvasPosition.x > graphics.centerPoint.x) ballCanvasPosition.x += XOffset;

				// If the ball is past the center Y point, translate Y position by YOffset
				if (ballCanvasPosition.y > graphics.centerPoint.y) ballCanvasPosition.y += YOffset;

				// Update the ball location
				physics.SetBodyCanvasPosition(entityManager.GetEntity(currentEntity).physicsBody, ballCanvasPosition);
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
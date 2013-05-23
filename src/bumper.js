// src.bumper.js

// Class: bumper
// A player bumper, used by the player to deflect balls

function bumper(startAngle, endAngle, color, lineWidth) {
	this.startAngle = startAngle;
	this.endAngle = endAngle;
	this.color = color;
	this.lineWidth = lineWidth;
};

// Create the physics body for this ball
bumper.prototype.CreatePhysicsBody = function() {
	var physicsX = physics.ScaleToPhysics(graphics.centerPoint.x);
	var physicsY = physics.ScaleToPhysics(graphics.centerPoint.y);

	// Create the body definition
	var bodyDefinition = new b2BodyDef;
	bodyDefinition.type = b2Body.b2_staticBody;
	bodyDefinition.position.x = physicsX;
	bodyDefinition.position.y = physicsY;
	bodyDefinition.angle = this.startAngle;

	// Create a physics body out of the definition
	var body = physics.world.CreateBody(bodyDefinition);

	// Apply a circular bounding box to the body (used for hit detection)
	physics.standardFixture.shape = this.BuildPhysicsBodyShape();
	body.CreateFixture(physics.standardFixture);

	// Return the newly created physics body
	return (body);
};

bumper.prototype.BuildPhysicsBodyShape = function() {
	// Determine the total number of verticies needed for the bumper
	var vertexCount = Math.min(physics.maxVertexPoints - 2, Math.floor((this.endAngle - this.startAngle) / 0.05) + 1);

	// The list of verticies used to build the bumper
	var vertexList = [];

	// Calculate the radius of the bumper
	var radius = physics.ScaleToPhysics(graphics.canvas.width * 0.1);

	// Start the shape in the center of the physics body
	vertexList.push(new b2Vec2(0, 0));

	// Build a series of verticies that represent the bumper shape
	var currentAngle = this.startAngle * Math.PI;
	for (var currentVertex = 0; currentVertex <= vertexCount; currentVertex++) {
		// Add the current vertext to the list
		vertexList.push(new b2Vec2(radius * Math.cos(currentAngle), radius * Math.sin(currentAngle)));

		// Increment the angle for the next vertex
		currentAngle += ((this.endAngle - this.startAngle) / vertexCount) * Math.PI;
	}

	// Create a physics shape based off the vertex list
	var bodyShape = new b2PolygonShape();
	bodyShape.SetAsArray(vertexList, vertexList.length);

	return (bodyShape);
}

bumper.prototype.UpdatePhysicsBody = function(physicsBody) {
	physicsBody.SetAngle(bumperManager.originAngle * Math.PI);
}

// Draw the bumper graphic onto the canvas
bumper.prototype.Draw = function(drawingContext) {
	// Calculate the starting angle of the bumper segment
	var orientedStartAngle = this.startAngle + bumperManager.originAngle;
	if (orientedStartAngle > 2) orientedStartAngle = orientedStartAngle % 2;

	// Calculate the ending angle of the bumper segment
	var orientedEndAngle = this.endAngle + bumperManager.originAngle;
	if (orientedEndAngle > 2) orientedEndAngle = orientedEndAngle % 2;

	// Open the canvas for drawing
	drawingContext.beginPath();

	// Define the bumper segment based off of the previous calculations
	drawingContext.arc(graphics.centerPoint.x,
		graphics.centerPoint.y,
		graphics.canvas.width * 0.1,
		orientedStartAngle * Math.PI,
		orientedEndAngle * Math.PI, false);

	// Set the width and color of the bumper segment
	drawingContext.lineWidth = this.lineWidth;
	drawingContext.strokeStyle = this.color;

	// Draw the bumper segment
	drawingContext.stroke();
};

// Class: bumperManager
// The bumper at the center of the screen, controlled by the player
var bumperManager = {
	// The bumper orientation angle
	originAngle: 0,

	// Builds the bumper objects and readies them for the game
	Initialize: function() {
		bumperManager.BuildBumpers();
	},

	// Build an array of bumpers for the player to use
	BuildBumpers: function() {
		var currentBumper = {}

		// Bumper 1
		currentBumper = new bumper(0.00, 1.00, graphics.GetRandomColor(), 8);
		entityManager.AddEntity(entityManager.types.bumper, currentBumper.CreatePhysicsBody(), currentBumper);

		// Bumper 2
		currentBumper = new bumper(1.50, 1.70, graphics.GetRandomColor(), 8);
		entityManager.AddEntity(entityManager.types.bumper, currentBumper.CreatePhysicsBody(), currentBumper);

		// Bumper 3
		currentBumper = new bumper(1.75, 1.95, graphics.GetRandomColor(), 8);
		entityManager.AddEntity(entityManager.types.bumper, currentBumper.CreatePhysicsBody(), currentBumper);
	},

	// Update the origin angle that all bumpers orient themselves around
	UpdateOriginAngle: function(delta) {
		// Move the bumper origin angle backwards or forwards depending on the direction of the mouse drag
		bumperManager.originAngle = bumperManager.originAngle + (delta) * (1 / 250);

		// If the bumper origin angle hits either 0*pi (~0 degrees) or 2*pi (~360 degrees), flip it around 
		// (this lets the bumper continually spin as the player drags)
		if (bumperManager.originAngle > 2) bumperManager.originAngle = 0;
		else if (bumperManager.originAngle < 0) bumperManager.originAngle = 2;
	}
};
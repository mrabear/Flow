// src.bumper.js

// Class: bumper
// A player bumper, used by the player to deflect balls

function bumper(x, y, startAngle, endAngle, color, lineWidth) {
	this.x = x;
	this.y = y;
	this.startAngle = startAngle;
	this.endAngle = endAngle;
	this.color = color;
	this.lineWidth = lineWidth;
};

// Create the physics body for this ball
bumper.prototype.CreatePhysicsBody = function() {
	var physicsX = physics.CanvasToPhysics(graphics.centerPoint.x);
	var physicsY = physics.CanvasToPhysics(graphics.centerPoint.y);

	// Create the body definition
	var bodyDefinition = new b2BodyDef;
	bodyDefinition.type = b2Body.b2_staticBody;
	bodyDefinition.position.x = physicsX;
	bodyDefinition.position.y = physicsY;
	bodyDefinition.angle = (bumperManager.originAngle) * Math.PI;

	// Create a physics body out of the definition
	var body = physics.world.CreateBody(bodyDefinition);

	// Apply a circular bounding box to the body (used for hit detection)
	physics.standardFixture.shape = this.BuildPhysicsBodyShape();
	body.CreateFixture(physics.standardFixture);

	// Return the newly created physics body
	return (body);
};

// Returns a physics polygon for the bumper
bumper.prototype.BuildPhysicsBodyShape = function() {
	// Determine the total number of verticies needed for the bumper
	var vertexCount = Math.min(physics.maxVertexPoints - 2, Math.floor((this.endAngle - this.startAngle) / bumperManager.vertexWidth) + 1);

	// The list of verticies used to build the bumper
	var vertexList = [];

	// Calculate the radius of the bumper
	var radius = physics.CanvasToPhysics(graphics.canvas.width * bumperManager.widthRatio + bumperManager.physicsBorderPadding);

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

// Update the bumper physics body to match the current spin angle
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
	drawingContext.arc(this.x,
		this.y,
		graphics.canvas.width * bumperManager.widthRatio,
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

	// The percentage of the canvas width to use for the bumper diameter
	widthRatio: 0.1,

	// The width (in pixels) of the bumper border
	visualBorderWidth: 8,

	// The amount of space (in pixels) to pad the physics objects
	// Used to fine tune the alignment of the physics body to the visual object
	physicsBorderPadding: 5,

	// The width (in radians) of each segment of the bumper physics body
	vertexWidth: 0.05,

	// List of bumper colors
	bumperColorList: [graphics.GetRandomColor(), graphics.GetRandomColor(), graphics.GetRandomColor()],

	// Builds the bumper objects and readies them for the game
	Initialize: function() {},

	// Build an array of bumpers for the player to use
	BuildBumpers: function() {
		var currentBumper = {}

		// Bumper 1
		currentBumper = new bumper(graphics.centerPoint.x, graphics.centerPoint.y, 0.00, 1.00, bumperManager.bumperColorList[0], bumperManager.visualBorderWidth);
		entityManager.AddEntity(entityManager.types.bumper, currentBumper.CreatePhysicsBody(), currentBumper);

		// Bumper 2
		currentBumper = new bumper(graphics.centerPoint.x, graphics.centerPoint.y, 1.50, 1.70, bumperManager.bumperColorList[1], bumperManager.visualBorderWidth);
		entityManager.AddEntity(entityManager.types.bumper, currentBumper.CreatePhysicsBody(), currentBumper);

		// Bumper 3
		currentBumper = new bumper(graphics.centerPoint.x, graphics.centerPoint.y, 1.75, 1.95, bumperManager.bumperColorList[2], bumperManager.visualBorderWidth);
		entityManager.AddEntity(entityManager.types.bumper, currentBumper.CreatePhysicsBody(), currentBumper);
	},

	// Update the origin angle that all bumpers orient themselves around
	UpdateOriginAngle: function(mousePosition) {
		// Move the bumper origin angle to point toward the mouse cursor
		bumperManager.originAngle = physics.AngleToTarget(graphics.centerPoint, mousePosition) / Math.PI;
	}
};
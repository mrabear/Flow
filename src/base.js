// src.base.js

// Class: base
// the core that the player is trying to protect

function base(x, y, radius, color) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color || "red";
};

// Create the physics body for this base
base.prototype.CreatePhysicsBody = function() {
	// Create the physics body definition
	var bodyDefinition = new b2BodyDef;
	bodyDefinition.type = b2Body.b2_staticBody;
	bodyDefinition.position.x = physics.CanvasToPhysics(this.x);
	bodyDefinition.position.y = physics.CanvasToPhysics(this.y);

	// Create the sensor physics body
	var body = physics.world.CreateBody(bodyDefinition);

	// Apply a circular bounding box to the body (used for hit detection)
	var sensorFixture = new b2FixtureDef;
	sensorFixture.isSensor = true;
	sensorFixture.shape = new b2CircleShape(physics.CanvasToPhysics(graphics.canvas.width * bumperManager.widthRatio * 0.9));
	body.CreateFixture(sensorFixture);

	// Return the newly created physics body
	return (body);
};

// Draws the base onto the canvas
base.prototype.Draw = function(drawingContext) {
	// Open the canvas for drawing
	drawingContext.beginPath();

	// Update the position of the ball
	this.x = physics.PhysicsToCanvas(entityManager.GetEntity(this.id).physicsBody.GetPosition().x);
	this.y = physics.PhysicsToCanvas(entityManager.GetEntity(this.id).physicsBody.GetPosition().y);

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
};

// Class: baseManager
var baseManager = {
	// The percentage of the canvas width to use for the base diameter
	widthRatio: 0.05,

	Initialize: function(){
	},

	// Build new instances of the game bases
	BuildBases: function(){
		// Base 1
		var currentBase = new base(graphics.centerPoint.x, graphics.centerPoint.y, graphics.canvas.width * baseManager.widthRatio, "#000000");
		entityManager.AddEntity(entityManager.types.base, currentBase.CreatePhysicsBody(), currentBase);		
	}
};
// src.physics.js
// Contains the physics implementation of the game world

// Shortcuts for the Box2dWeb libraries
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

var physics = {
	// The physics world simulation
	world: {},

	// The physics visualization layer
	visualizationLayer: {},

	// How many pixels to draw per meter in the physics simulation
	// Used to convert from the canvas coordianate system (pixels) to the physics simulation system (meters)
	scale: 30,

	// The prototype dynamic physics fixture, used as a template for most objects
	standardFixture: {},

	contactListener: new Box2D.Dynamics.b2ContactListener,

	// Initialize the physics world 
	Initialize: function() {
		// Create a test object
		physics.world = new b2World(new b2Vec2(0, 0), true);

		physics.world.SetContactListener(physics.contactListener);

		// Setup the physics visualization layer
		physics.visualizationLayer = new b2DebugDraw();
		physics.visualizationLayer.SetSprite(graphics.drawingContext);
		physics.visualizationLayer.SetDrawScale(physics.scale);
		physics.visualizationLayer.SetFillAlpha(0.3);
		physics.visualizationLayer.SetLineThickness(1.0);
		physics.visualizationLayer.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		physics.world.SetDebugDraw(physics.visualizationLayer);

		// Build the prototype dynamic physics fixture
		physics.standardFixture = new b2FixtureDef;
		physics.standardFixture.density = 1.0;
		physics.standardFixture.friction = 0.0;
		physics.standardFixture.restitution = 1.5;

		physics.SetupBoundarySensors();
	},

	// Increment the physics simulation by a single frame
	Step: function() {
		physics.world.Step(1 / 60, 10, 10);
		physics.world.ClearForces();
	},

	// Apply an impulse force to the given body
	ApplyImpulseToBody: function(body, power, angle) {
		body.ApplyImpulse(
		new b2Vec2(Math.cos(angle) * power,
		Math.sin(angle) * power),
		body.GetWorldCenter());
	},

	// Get the canvas position of the given body
	GetBodyCanvasPosition: function(body) {
		var bodyPosition = body.GetPosition();
		return ({
			x: bodyPosition.x * physics.scale,
			y: bodyPosition.y * physics.scale
		});
	},

	// Set the canvas position of the given body
	// canvasPosition: The canvas-local destination coordinates 
	SetBodyCanvasPosition: function(body, canvasPosition) {
		body.SetPosition(new b2Vec2(canvasPosition.x / physics.scale, canvasPosition.y / physics.scale));
	},

	// Given two positions, Calculates the angle to a target
	AngleToTarget: function(sourcePosition, targetPosition) {
		// Calculates the difference between the two given points
		var deltaPosition = {
			x: targetPosition.x - sourcePosition.x,
			y: targetPosition.y - sourcePosition.y
		};

		// Returns the angle to the target
		return (Math.atan2(deltaPosition.y, deltaPosition.x));
	},

	// Create boundary sensors just beyond the edge of the physics simulation
	// This is primarily used to detect and remove physics bodies that have left the game world
	SetupBoundarySensors: function() {
		// Create the sensor fixture template
		var sensorFixture = new b2FixtureDef;
		sensorFixture.isSensor = true;
		sensorFixture.shape = new b2PolygonShape();

		// Create the physics body definition
		var sensorBodyDef = new b2BodyDef;
		sensorBodyDef.type = b2Body.b2_staticBody;

		// Center the body to the middle of the canvas
		sensorBodyDef.position.x = graphics.centerPoint.x / physics.scale;
		sensorBodyDef.position.y = graphics.centerPoint.y / physics.scale;

		// Create the sensor physics body
		var sensorBody = physics.world.CreateBody(sensorBodyDef);

		// Calculate the dimensions of the boundary sensors
		var boundaryHeight = Math.max( graphics.canvas.height, graphics.canvas.width ) * 1.5 / physics.scale;
		var boundaryWidth = 10 / physics.scale;
		var boundaryDistanceFromEdge = 250 / physics.scale;

		// Attach the right boundary sensor
		sensorFixture.shape.SetAsOrientedBox(boundaryWidth, boundaryHeight, new b2Vec2((graphics.centerPoint.x / physics.scale + boundaryDistanceFromEdge), 0), 0);
		sensorBody.CreateFixture(sensorFixture);

		// Attach the top boundary sensor
		sensorFixture.shape.SetAsOrientedBox(boundaryWidth, boundaryHeight, new b2Vec2(0, (-1 * graphics.centerPoint.y / physics.scale - boundaryDistanceFromEdge)), Math.PI / 2);
		sensorBody.CreateFixture(sensorFixture);

		// Attach the left boundary sensor
		sensorFixture.shape.SetAsOrientedBox(boundaryWidth, boundaryHeight, new b2Vec2((-1 * graphics.centerPoint.x / physics.scale - boundaryDistanceFromEdge), 0), 0);
		sensorBody.CreateFixture(sensorFixture);

		// Attach the bottom boundary sensor
		sensorFixture.shape.SetAsOrientedBox(boundaryWidth, boundaryHeight, new b2Vec2(0, (graphics.centerPoint.y / physics.scale + boundaryDistanceFromEdge)), Math.PI / 2);
		sensorBody.CreateFixture(sensorFixture);

		// Add the sensor body to the entity list
		entityManager.AddEntity(entityManager.types.boundary, sensorBody, null);
	}
};

// Called whenver there is contact between two physics objects
physics.contactListener.BeginContact = function(contact) {
	// Get the entity IDs of the two colliding bodies
	var bodyAEntityID = contact.GetFixtureA().GetBody().GetUserData();
	var bodyBEntityID = contact.GetFixtureB().GetBody().GetUserData();

	// Determine the type of the two objects
	var bodyAType = entityManager.GetEntity(bodyAEntityID).type;
	var bodyBType = entityManager.GetEntity(bodyBEntityID).type;

	// If the object strcuk a boundary, schedule it for deletion
	if ((bodyAType == entityManager.types.boundary) || (bodyAType == entityManager.types.boundary)) {
		if (bodyAType == entityManager.types.ball) entityManager.GetEntity(bodyAEntityID).type = entityManager.types.remove;
		if (bodyBType == entityManager.types.ball) entityManager.GetEntity(bodyBEntityID).type = entityManager.types.remove;
	}
}
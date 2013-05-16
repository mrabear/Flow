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
	visualization: {},

	// The pixel/km scale
	scale: 30,

	// The list of active physics bodies in the current simulation
	bodies: [],

	bodiesToDelete: [],

	// The prototype dynamic physics fixture, used as a template for most objects
	standardFixture: {},

	contactListener: new Box2D.Dynamics.b2ContactListener,

	// Initialize the physics world 
	Initialize: function() {
		// Create a test object
		physics.world = new b2World(new b2Vec2(0, 0), true);

		physics.world.SetContactListener(physics.contactListener);

		// Setup the physics visualization layer
		physics.visualization = new b2DebugDraw();
		physics.visualization.SetSprite(graphics.drawingContext);
		physics.visualization.SetDrawScale(physics.scale);
		physics.visualization.SetFillAlpha(0.3);
		physics.visualization.SetLineThickness(1.0);
		physics.visualization.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		physics.world.SetDebugDraw(physics.visualization);

		// Build the prototype dynamic physics fixture
		physics.standardFixture = new b2FixtureDef;
		physics.standardFixture.density = 1.0;
		physics.standardFixture.friction = 0.0;
		physics.standardFixture.restitution = 1.5;

		var sensorFixture = new b2FixtureDef;
		sensorFixture.isSensor = true;
		sensorFixture.shape = new b2PolygonShape();
		sensorFixture.shape.SetAsBox(100 / physics.scale, 100 / physics.scale);

		var sensorBody = new b2BodyDef;
		sensorBody.type = b2Body.b2_staticBody;
		//sensorBody.userData = physics.bodyTypes.boundry;

		// positions the center of the object (not upper left!)
		sensorBody.position.x = graphics.centerPoint.x / physics.scale;
		sensorBody.position.y = graphics.centerPoint.y / physics.scale;
		physics.world.CreateBody(sensorBody).CreateFixture(sensorFixture);

		// Add the sensor to the entity list
		entityManager.AddEntity(entityManager.types.boundry, sensorBody, null);
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
		var deltaPosition = {
			x: targetPosition.x - sourcePosition.x,
			y: targetPosition.y - sourcePosition.y
		};

		return (Math.atan2(deltaPosition.y, deltaPosition.x));
	},

	CleanUpBodies: function() {
		var bodyTotal = physics.bodiesToDelete.length;

		for( var currentBody = 0 ; currentBody < bodyTotal ; currentBody++ ){
			physics.world.DestroyBody(physics.bodiesToDelete[currentBody]);
		}
		physics.bodiesToDelete = [];
	}
};

physics.contactListener.BeginContact = function(contact) {
	var bodyAType = contact.GetFixtureA().GetBody().GetUserData();
	var bodyBType = contact.GetFixtureB().GetBody().GetUserData();

	if ((bodyAType == entityManager.types.boundry) || (bodyAType == entityManager.types.boundry)) {
		if (bodyAType == physics.bodyTypes.ball) entityManager.entities( bodyAType + "" ).type = entityManager.types.remove;
		if (bodyBType == physics.bodyTypes.ball) entityManager.entities( bodyBType + "" ).type = entityManager.types.remove;
	}
}
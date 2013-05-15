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

	// Set to true to visualize the physics entities
	visualizePhysics: true,

	bodies: [],

	standardFixture: {},

	Initialize: function() {
		// Create a test object
		physics.world = new b2World(
		new b2Vec2(0, 0) //gravity
		,
		true //allow sleep
		);

		if (physics.visualizePhysics) {
			physics.visualization = new b2DebugDraw();
			physics.visualization.SetSprite(graphics.drawingContext);
			physics.visualization.SetDrawScale(physics.scale);
			physics.visualization.SetFillAlpha(0.3);
			physics.visualization.SetLineThickness(1.0);
			physics.visualization.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			physics.world.SetDebugDraw(physics.visualization);
		}

		physics.standardFixture = new b2FixtureDef;
		physics.standardFixture.density = 1.0;
		physics.standardFixture.friction = 0.0;
		physics.standardFixture.restitution = 1.0;
	},

	Step: function() {

		physics.world.Step(
		1 / 60 //frame-rate
		,
		10 //velocity iterations
		,
		10 //position iterations
		);

		physics.world.DrawDebugData();
		physics.world.ClearForces();
	},

	ApplyImpulseToBody: function(body, power, angle) {
		body.ApplyImpulse(
		new b2Vec2(Math.cos(angle * (Math.PI / 180)) * power,
		Math.sin(angle * (Math.PI / 180)) * power),
		body.GetWorldCenter());
	}
};
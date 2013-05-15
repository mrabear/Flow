// src.Physics.js
// Contains the physics implementation of the game world
var Physics = {

	// Shortcuts for the Box2dWeb libraries
	b2Vec2: Box2D.Common.Math.b2Vec2,
	b2BodyDef: Box2D.Dynamics.b2BodyDef,
	b2Body: Box2D.Dynamics.b2Body,
	b2FixtureDef: Box2D.Dynamics.b2FixtureDef,
	b2Fixture: Box2D.Dynamics.b2Fixture,
	b2World: Box2D.Dynamics.b2World,
	b2MassData: Box2D.Collision.Shapes.b2MassData,
	b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape: Box2D.Collision.Shapes.b2CircleShape,
	b2DebugDraw: Box2D.Dynamics.b2DebugDraw,

	// The physics world simulation
	World: {},

	// The physics visualization layer
	Visualization: {},

	// The pixel/km scale
	Scale: 30,

	// Set to true to visualize the physics entities
	VisualizePhysics: true,

	Initialize: function() {
		// Create a test object
		Physics.World = new Physics.b2World(
		new Physics.b2Vec2(0, 0) //gravity
		,
		true //allow sleep
		);

		if (Physics.VisualizePhysics) {
			Physics.Visualization = new Physics.b2DebugDraw();
			Physics.Visualization.SetSprite(Graphics.DrawingContext);
			Physics.Visualization.SetDrawScale(Physics.Scale);
			Physics.Visualization.SetFillAlpha(0.3);
			Physics.Visualization.SetLineThickness(1.0);
			Physics.Visualization.SetFlags(Physics.b2DebugDraw.e_shapeBit | Physics.b2DebugDraw.e_jointBit);
			Physics.World.SetDebugDraw(Physics.Visualization);
		}

		var fixDef = new Physics.b2FixtureDef;

		var bodyDef = new Physics.b2BodyDef;

		//create some objects
		bodyDef.type = Physics.b2Body.b2_dynamicBody;
		bodyDef.position.x = Math.random() * 10;
		bodyDef.position.y = Math.random() * 10;

		fixDef.shape = new Physics.b2CircleShape(
		Math.random() + 0.1 //radius
		);
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;

		Physics.World.CreateBody(bodyDef).CreateFixture(fixDef);
	},

	Step: function() {
		Physics.World.Step(
		1 / 60 //frame-rate
		,
		10 //velocity iterations
		,
		10 //position iterations
		);

		Physics.World.DrawDebugData();
		Physics.World.ClearForces();
	}

};
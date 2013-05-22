// src.bumper.js

// Class: bumperSegment
// A single segment of the player bumper

function bumperSegment(length, offset, color, lineWidth) {
	this.length = length;
	this.offset = offset;
	this.color = color;
	this.lineWidth = lineWidth;
};

// Create the physics body for this ball
bumperSegment.prototype.CreatePhysicsBody = function() {
	var physicsX = physics.CanvasCoordToPhysics(graphics.centerPoint.x);
	var physicsY = physics.CanvasCoordToPhysics(graphics.centerPoint.y);

	// Create the body definition
	var bodyDefinition = new b2BodyDef;
	bodyDefinition.type = b2Body.b2_staticBody;
	bodyDefinition.position.x = physicsX;
	bodyDefinition.position.y = physicsY;
	bodyDefinition.angle = bumper.angle + this.offset;

	// Create a physics body out of the definition
	var body = physics.world.CreateBody(bodyDefinition);

	var bodyShape = new b2PolygonShape();
	var vertexList = [];

	//Setting up Vertices in an Array   
	vertexList.push(new b2Vec2( 0,0));
	vertexList.push(new b2Vec2( 1, 2));
	vertexList.push(new b2Vec2( 1, 4));
	vertexList.push(new b2Vec2( -4, 1));

	//b2Vec2 Array then Vertex Count
	bodyShape.SetAsArray(vertexList, vertexList.length);

	// Apply a circular bounding box to the body (used for hit detection)
	physics.standardFixture.shape = bodyShape;
	body.CreateFixture(physics.standardFixture);

	// Return the newly created physics body
	return (body);
};

// Class: bumper
// The bumper at the center of the screen, controlled by the player
var bumper = {

	// The list of all active bumper segments
	segments: [],

	// The bumper orientation angle
	angle: 0,

	// Builds the bumper objects and readies them for the game
	Initialize: function() {
		bumper.BuildBumperSegments();

		// TEMPORARY PHYSICS BODY, NEED TO SEGMENTIZE IT
		// Create the body definition
		//var bodyDefinition = new b2BodyDef;
		//bodyDefinition.type = b2Body.b2_staticBody;
		//bodyDefinition.position.x = graphics.centerPoint.x / physics.scale;
		//bodyDefinition.position.y = graphics.centerPoint.y / physics.scale;

		// Create a physics body out of the definition
		//var body = physics.world.CreateBody(bodyDefinition);

		// Apply a circular bounding box to the body (used for hit detection)
		//physics.standardFixture.shape = new b2CircleShape(graphics.canvas.width * 0.1 / physics.scale);
		//body.CreateFixture(physics.standardFixture);
		// Add the sensor body to the entity list
		entityManager.AddEntity(entityManager.types.bumper, bumper.segments[0].CreatePhysicsBody(), null);

	},

	// Build an array of bumpers for the player to use
	BuildBumperSegments: function() {
		//bumper.segments.push(new bumperSegment(0.2, 0.25, graphics.GetRandomColor(), 7));
		bumper.segments.push(new bumperSegment(0.9, 0.25, graphics.GetRandomColor(), 8));
		bumper.segments.push(new bumperSegment(0.2, 1.50, graphics.GetRandomColor(), 8));
		bumper.segments.push(new bumperSegment(0.2, 1.75, graphics.GetRandomColor(), 8));
	},

	// Draw all of the current bumpers
	DrawBumperSegments: function(drawingContext) {
		// The total number of bumpers to draw (used in the for loop, cached in a var for performance reasons)
		var bumperTotal = bumper.segments.length;

		// The start and end angles for each bumper segment
		var startAngle, endAngle;

		// Loop through each bumper segment, calculate it's position, and draw it
		for (var bumperIndex = 0; bumperIndex < bumperTotal; bumperIndex++) {
			// Calculate the starting angle of the bumper segment
			startAngle = bumper.angle + bumper.segments[bumperIndex].offset;
			if (startAngle > 2) startAngle = startAngle % 2;

			// Calculate the ending angle of the bumper segment
			endAngle = bumper.angle + bumper.segments[bumperIndex].length + bumper.segments[bumperIndex].offset;
			if (endAngle > 2) endAngle = endAngle % 2;

			// Open the canvas for drawing
			drawingContext.beginPath();

			// Define the bumper segment based off of the previous calculations
			drawingContext.arc(graphics.centerPoint.x,
				graphics.centerPoint.y,
				graphics.canvas.width * 0.1,
				startAngle * Math.PI,
				endAngle * Math.PI, false);

			// Set the width and color of the bumper segment
			drawingContext.lineWidth = bumper.segments[bumperIndex].lineWidth;
			drawingContext.strokeStyle = bumper.segments[bumperIndex].color;

			// Draw the bumper segment
			drawingContext.stroke();
		}
	}
};
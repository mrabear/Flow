function ball(id, x, y, radius, color) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.radius = radius || 30;
	this.color = color || "red";
	this.body = this.CreatePhysicsBody();
};

ball.prototype.CreatePhysicsBody = function() {
	// Create the body definition
	var bodyDefinition = new b2BodyDef;
	bodyDefinition.type = b2Body.b2_dynamicBody;
	bodyDefinition.position.x = this.x / physics.scale;
	bodyDefinition.position.y = this.y / physics.scale;
	bodyDefinition.userData = this.id;

	// Create a physics body out of the definition
	var body = physics.world.CreateBody(bodyDefinition);

	// Apply a circular bounding box to the body (used for hit detection)
	physics.standardFixture.shape = new b2CircleShape( this.radius / physics.scale );
	body.CreateFixture(physics.standardFixture);

	return (body);
};

ball.prototype.draw = function(drawingContext) {
	// Open the canvas for drawing
	drawingContext.beginPath();

	// Update the position of the ball
	this.x = this.body.GetPosition().x * physics.scale; //ballManager.instances[currentBall].x + ballManager.instances[currentBall].speed * Math.cos(ballManager.instances[currentBall].angle);
	this.y = this.body.GetPosition().y * physics.scale; //ballManager.instances[currentBall].y + ballManager.instances[currentBall].speed * Math.sin(ballManager.instances[currentBall].angle);

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
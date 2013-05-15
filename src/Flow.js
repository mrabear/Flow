// src.Flow.js
// The main entry point for the game, starts the main loop after the DOM is ready
var Flow = {
	// Initializes the graphics, sound, input, and game objects
	Initialize: function() {
		// Initialize the graphics objects
		Graphics.Initialize();

		// Build the bumpers
		Bumper.Initialize();

		// Register the input handlers
		Input.Initialize();

		// Initialize the physics world
		Physics.Initialize();

		// Start the game loop
		Flow.ProcessGameLoop();
	},

	// Called every game tick, processes all graphics and game logic
	ProcessGameLoop: function() {
		// Calls out to the polyfill library to request an animation frame in a browser safe way.
		// This will stage the canvas and call ProcessGameLoop again when the rest of the drawing functions are complete
		requestAnimationFrame(Flow.ProcessGameLoop);

		// Attempt to spawn a ball
		//Balls.SpawnBall();

		// Advance the physics simulation by a single step
		Physics.Step();

		// Render the next graphics frame
		Graphics.RenderFrame();
	}
};

//Wait for DOM to load before starting a game
$(window).ready(function() {
	Flow.Initialize();
});
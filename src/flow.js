// src.flow.js
// Class: flow
// The main entry point for the game, starts the main loop after the DOM is ready
var flow = {
	// Initializes the graphics, sound, input, and game objects
	Initialize: function() {
		// Initialize the graphics objects
		graphics.Initialize();

		// Initialize the physics world
		physics.Initialize();

		// Fit the physics and graphics objects to the browser
		graphics.ResizeCanvas();

		// Rebuild any objects that are purged during the resizing
		// (e.g. physics objects that are locked and can't be modified)
		flow.RebuildGameObjects();

		// Register the input handlers
		input.Initialize();

		// Start the game loop
		flow.ProcessGameLoop();
	},

	// Called every game tick, processes all graphics and game logic
	ProcessGameLoop: function() {
		// Calls out to the polyfill library to request an animation frame in a browser safe way.
		// This will stage the canvas and call ProcessGameLoop again when the rest of the drawing functions are complete
		requestAnimationFrame(flow.ProcessGameLoop);

		// Attempt to spawn a ball
		ballManager.SpawnBall();

		// Advance the physics simulation by a single step
		physics.Step();

		// Render the next graphics frame
		graphics.RenderFrame();

		// Clean up entities that have been marked for removal
		entityManager.CleanUpEntities();
	},

	// Rebuild the standard game objects
	RebuildGameObjects: function() {
		// Rebuild the boundary sensors
		physics.SetupBoundarySensors();

		// Rebuild the player bumpers
		bumperManager.BuildBumpers();

		// Rebuild the bases
		baseManager.BuildBases();
	}
};

//Wait for DOM to load before starting a game
$(window).ready(function() {
	flow.Initialize();
});
// src.Flow.js
// The main entry point for the game, starts the main loop after the DOM is ready
var Flow = 
{
	// Initializes the graphics, sound, input, and game objects
	Initialize: function()
	{
		// Initialize the graphics objects
		Graphics.Initialize();

		// Build the bumpers
		Bumper.Initialize();

		// Register the input handlers
		Input.Initialize();
	},

	// Called every game tick, processes all graphics and game logic
	ProcessGameLoop: function() 
	{
		// Attempt to spawn a ball
		Balls.SpawnBall();

		// Render the next graphics frame
		Graphics.RenderFrame();
	}
};

//Wait for DOM to load before starting a game
$(window).ready(function(){ 
	Flow.Initialize(); 
});

// Start the game loop
setInterval(Flow.ProcessGameLoop, Graphics.FramesPerSecond);


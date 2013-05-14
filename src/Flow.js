// src.Flow.js
// The main entry point for the game, starts the main loop after the DOM is ready

//Wait for DOM to load before starting a game
$(window).ready(function(){ 
	Game.Initialize(); 
});

var Game = 
{
	Initialize: function()
	{

		Graphics.Initialize();

		// Build the bumpers
		Bumper.Initialize();

		Input.Initialize();
	},

	ProcessGameLoop: function() 
	{
		Balls.SpawnBall();
		Graphics.DrawFrame();
	}
};

// Start the game loop
setInterval(Game.ProcessGameLoop, 30);

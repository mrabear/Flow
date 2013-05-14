
//Wait for DOM to load before starting a game
$(window).ready(function(){ 
	Initialize(); 
});

//var Game = {
    //ingredient: "Bacon Strips",
     
    //public method
    //fry: function() { console.log( "Frying " + this.ingredient ); }
	var DrawingContext, Canvas;

	var AspectRatio = 0.75;
	var MinCanvasSize = { width: 800, height: 600};

	var MouseXY = {x: 0, y: 0};
	var IsMouseDown = false;

	var GameSurfaceBounds = {};

	var Bumpers = [];
	var BumperAngle = 0;

	var Balls = [];

	function Initialize(){

	    // Find the drawing canvas
		Canvas = document.getElementById('GameCanvas');

		// Get a handle to the 2d context of the canvas
		DrawingContext = Canvas.getContext('2d'); 

		// Defines important points in the game surface
		GameSurfaceBounds.TopLeft = {};
		GameSurfaceBounds.Center = {};
		
		// Resize the canvas to fit the browser window
		ResizeCanvas();

		// Build the bumpers
		BuildBumpers();

		InitializeInput();
	}

	// Resizes the canvas to maximize it in the browser window
	function ResizeCanvas()
	{
		// Only resize if the window has changed 
		if(( Canvas.width != document.width) || ( Canvas.height != document.height))
		{
			// Resize the canvas to fit the window
			Canvas.width = Math.max( MinCanvasSize.width, document.width );
			Canvas.height = Math.max( MinCanvasSize.height, document.height );

			// Resize the game surface
			GameSurfaceBounds.width = Math.max( MinCanvasSize.width, Math.round( Math.min( document.width, document.height )));
			GameSurfaceBounds.height = Math.round( GameSurfaceBounds.width * 0.75 );

			// The top left corner of the game surface
			GameSurfaceBounds.TopLeft.x = ( document.width - GameSurfaceBounds.width ) / 2;
			GameSurfaceBounds.TopLeft.y = ( document.height - GameSurfaceBounds.height ) / 2;

			// The center point of the game surface
			GameSurfaceBounds.Center.x = document.width / 2;
			GameSurfaceBounds.Center.y = document.height / 2;
		}
	}

	function Draw()
	{
		// Resize the canvas (if the browser has been resized)
		ResizeCanvas();

		DrawBorders();

		DrawBumpers();

		DrawBalls();

		SpawnBalls();
	}

	function DrawBorders()
	{
		// outer border color
		DrawingContext.fillStyle="#555555";
		DrawingContext.fillRect(0, 0, Canvas.width, Canvas.height);
		
		// inner game surface color
		DrawingContext.fillStyle="#FFFFFF";
		DrawingContext.fillRect(GameSurfaceBounds.TopLeft.x, GameSurfaceBounds.TopLeft.y, GameSurfaceBounds.width, GameSurfaceBounds.height);	

		DrawingContext.font = "bold 12px sans-serif";
		DrawingContext.fillText( "Bumper Angle: " + BumperAngle + " (" + IsMouseDown + ")", 25, 25);	
		DrawingContext.fillText( "Canvas: " + Canvas.width + " x " + GameSurfaceBounds.height, 25, 40);	
		DrawingContext.fillText( "GameSurface: " + GameSurfaceBounds.width + " x " + GameSurfaceBounds.height, 25, 55);	
	}

	// Build an array of bumpers for the player to use
	function BuildBumpers()
	{
		Bumpers[0] = {Length: 0.2, Offset: 0.25, Color: "#000000", LineWdith: 10};
		Bumpers[1] = {Length: 0.2, Offset: 0.75, Color: "#FF0000", LineWdith: 10};
		Bumpers[2] = {Length: 0.2, Offset: 1.50, Color: "#000000", LineWdith: 10};
		Bumpers[3] = {Length: 0.2, Offset: 1.75, Color: "#FF0000", LineWdith: 10};
	}

	// Draw all of the current bumpers
	function DrawBumpers()
	{
		//console.log( "drawing bumpers " + Bumpers[0].Color )

	    var BumperTotal = Bumpers.length;
	    var StartAngle, EndAngle;

	    for( var BumperIndex = 0 ; BumperIndex < BumperTotal ; BumperIndex++ )
	    {
	    	StartAngle = BumperAngle + Bumpers[BumperIndex].Offset;
	    	if( StartAngle > 2 )
	    		StartAngle = StartAngle % 2;

	    	EndAngle = BumperAngle + Bumpers[BumperIndex].Length + Bumpers[BumperIndex].Offset;
	    	if( EndAngle > 2 )
	    		EndAngle = EndAngle % 2;

			DrawingContext.beginPath();

			DrawingContext.arc(GameSurfaceBounds.Center.x, 
							   GameSurfaceBounds.Center.y, 
							   GameSurfaceBounds.width * 0.1,
							   StartAngle * Math.PI , 
							   EndAngle * Math.PI, false);

			DrawingContext.lineWidth = Bumpers[BumperIndex].LineWdith;

			// line color
			DrawingContext.strokeStyle = Bumpers[BumperIndex].Color;
			DrawingContext.stroke();

			//DrawingContext.fillStyle = 'green';
			//DrawingContext.fill();
		}
	}

	function SpawnBalls()
	{
		if( Math.floor(Math.random() * 6000) < 1000 )
		{
			var BallX,BallY,Radius = 0;

			var Angle = Math.random() * 360;
			var Radius = Math.max(GameSurfaceBounds.Center.x - GameSurfaceBounds.TopLeft.x, GameSurfaceBounds.Center.y - GameSurfaceBounds.TopLeft.y ) + 30;

			Balls.push( {x: GameSurfaceBounds.Center.x + Radius * Math.cos(Angle), 
				         y: GameSurfaceBounds.Center.y + Radius * Math.sin(Angle),
				         Angle: Math.abs( 180 - Angle ),
				         Speed: Math.floor( Math.random() * 3), 
				         Color: "#000000"} );
		}
	}

	function DrawBalls()
	{
		var BallTotal = Balls.length;
		for( var CurrentBall = 0 ; CurrentBall < BallTotal ; CurrentBall++ )
		{
			DrawingContext.beginPath();

			// Update the position of the ball
			Balls[CurrentBall].x = Balls[CurrentBall].x + Balls[CurrentBall].Speed * Math.cos(Balls[CurrentBall].Angle);
			Balls[CurrentBall].y = Balls[CurrentBall].y + Balls[CurrentBall].Speed * Math.sin(Balls[CurrentBall].Angle);

			// Draw the ball onto the screen
			DrawingContext.arc(Balls[CurrentBall].x, 
							   Balls[CurrentBall].y, 
							   GameSurfaceBounds.width * 0.01,
							   0 * Math.PI , 
							   2 * Math.PI, false);


			// The ball outline
			DrawingContext.lineWidth = 3;
			DrawingContext.strokeStyle = "#000000";
			DrawingContext.stroke();

			// The ball fill
			DrawingContext.fillStyle = Balls[CurrentBall].Color;
			DrawingContext.fill();

		}
	}

	function ProcessFrame() {
		Draw();
	}

//};


setInterval(ProcessFrame, 30);

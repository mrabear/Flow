// src.Balls.js
// The collection of balls that spawn randomly and try to attack the player

var Balls = 
{
	Instance: [],

	SpawnBall: function()
	{
		if( Math.floor(Math.random() * 6000) < 1000 )
		{
			var BallX,BallY,Radius = 0;

			var Angle = Math.random() * 360;
			var Radius = Math.max(Graphics.GameSurfaceBounds.Center.x - Graphics.GameSurfaceBounds.TopLeft.x, Graphics.GameSurfaceBounds.Center.y - Graphics.GameSurfaceBounds.TopLeft.y ) + 30;

			Balls.Instance.push( {x: Graphics.GameSurfaceBounds.Center.x + Radius * Math.cos(Angle), 
				         y: Graphics.GameSurfaceBounds.Center.y + Radius * Math.sin(Angle),
				         Angle: Math.abs( 180 - Angle ),
				         Speed: Math.floor( Math.random() * 3), 
				         Color: "#000000"} );
		}
	},

	DrawBalls: function( DrawingContext )
	{
		var BallTotal = Balls.Instance.length;
		for( var CurrentBall = 0 ; CurrentBall < BallTotal ; CurrentBall++ )
		{
			DrawingContext.beginPath();

			// Update the position of the ball
			Balls.Instance[CurrentBall].x = Balls.Instance[CurrentBall].x + Balls.Instance[CurrentBall].Speed * Math.cos(Balls.Instance[CurrentBall].Angle);
			Balls.Instance[CurrentBall].y = Balls.Instance[CurrentBall].y + Balls.Instance[CurrentBall].Speed * Math.sin(Balls.Instance[CurrentBall].Angle);

			// Draw the ball onto the screen
			DrawingContext.arc(Balls.Instance[CurrentBall].x, 
							   Balls.Instance[CurrentBall].y, 
							   Graphics.GameSurfaceBounds.width * 0.01,
							   0 * Math.PI , 
							   2 * Math.PI, false);


			// The ball outline
			DrawingContext.lineWidth = 3;
			DrawingContext.strokeStyle = "#000000";
			DrawingContext.stroke();

			// The ball fill
			DrawingContext.fillStyle = Balls.Instance[CurrentBall].Color;
			DrawingContext.fill();
		}
	}
};
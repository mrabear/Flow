// src.Bumper.js
// The bumper at the center of the screen, controlled by the player

var Bumper = {

	Instance: [],
	Angle: 0,

	Initialize: function()
	{
		Bumper.BuildBumpers();
	},

	// Build an array of bumpers for the player to use
	BuildBumpers: function()
	{
		Bumper.Instance[0] = {Length: 0.2, Offset: 0.25, Color: "#000000", LineWdith: 10};
		Bumper.Instance[1] = {Length: 0.2, Offset: 0.75, Color: "#FF0000", LineWdith: 10};
		Bumper.Instance[2] = {Length: 0.2, Offset: 1.50, Color: "#000000", LineWdith: 10};
		Bumper.Instance[3] = {Length: 0.2, Offset: 1.75, Color: "#FF0000", LineWdith: 10};
	},

	// Draw all of the current bumpers
	DrawBumpers: function( DrawingContext )
	{
		//console.log( "drawing bumpers " + Bumpers[0].Color )

	    var BumperTotal = Bumper.Instance.length;
	    var StartAngle, EndAngle;

	    for( var BumperIndex = 0 ; BumperIndex < BumperTotal ; BumperIndex++ )
	    {
	    	StartAngle = Bumper.Angle + Bumper.Instance[BumperIndex].Offset;
	    	if( StartAngle > 2 )
	    		StartAngle = StartAngle % 2;

	    	EndAngle = Bumper.Angle + Bumper.Instance[BumperIndex].Length + Bumper.Instance[BumperIndex].Offset;
	    	if( EndAngle > 2 )
	    		EndAngle = EndAngle % 2;

			DrawingContext.beginPath();

			DrawingContext.arc(Graphics.GameSurfaceBounds.Center.x, 
								   Graphics.GameSurfaceBounds.Center.y, 
								   Graphics.GameSurfaceBounds.width * 0.1,
								   StartAngle * Math.PI , 
								   EndAngle * Math.PI, false);

			DrawingContext.lineWidth = Bumper.Instance[BumperIndex].LineWdith;

			// line color
			DrawingContext.strokeStyle = Bumper.Instance[BumperIndex].Color;
			DrawingContext.stroke();
		}
	}
};
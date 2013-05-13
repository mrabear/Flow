function InitializeInput()
{
	Canvas.addEventListener("mousedown", MouseDown, false);
	Canvas.addEventListener("mousemove", MouseMove, true);
	//GameCanvas.addEventListener("touchstart", TouchDown, false);
	//GameCanvas.addEventListener("touchmove", TouchXY, true);
	//GameCanvas.addEventListener("touchend", TouchUp, false);

	document.body.addEventListener("mouseup", MouseUp, false);
	//document.body.addEventListener("touchcancel", touchUp, false);
}

function MouseDown(e)
{
	IsMouseDown = true;
	MouseXY.x = e.pageX;
	MouseXY.y = e.pageY;
	console.log( IsMouseDown + "| Mouse Down at " + MouseXY.x + "," + MouseXY.y );
}

function MouseMove(e)
{
	//if( IsMouseDown )
	//{
		BumperAngle = BumperAngle + ( MouseXY.x - e.pageX ) * ( 1 / 250);

		if( BumperAngle > 2 )
			BumperAngle = 0;
		else if( BumperAngle < 0 )
			BumperAngle = 2;

		MouseXY.x = e.pageX;
		MouseXY.y = e.pageY;
	//}
}

function MouseUp(e)
{
	IsMouseDown = false;
}
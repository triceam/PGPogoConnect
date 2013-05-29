//
//  PGPogoConnect.m
//  PGPogoConnect
//
//  Created by Andrew Trice on 4/5/13.
//
//

#import "PGPogoConnect.h"
#import <Cordova/CDV.h>
#import "T1PogoManager.h"


@implementation PGPogoConnect

- (void)pluginInitialize {

    NSLog(@"PGPogoConnect Initializing...");
    
    PGPogoConnectGestureRecognizer * recognizer = [[PGPogoConnectGestureRecognizer alloc] initWithTarget:self action:@selector(emptySelector:)];
     
    recognizer.delegate = self;
    [self.webView addGestureRecognizer: recognizer];
    
    
    
    
    pogoManager = [T1PogoManager pogoManagerWithDelegate:self];	// be sure to retain if not using ARC
    [pogoManager retain];
    [pogoManager registerView:self.webView];	// pass a view that is receiving touch events.  In this case it's self.view
    
    [pogoManager setEnablePenInputOverNetworkIfIncompatiblePad:YES];	// allow pens to connect to iPad 1 & 2.  Highly recommended!
    
    self.webView.multipleTouchEnabled = YES;
    
    
    
    NSLog(@"Pogo SDK build number %d",[pogoManager buildNumber]);
    NSLog(@"PGPogoConnect Initialized");
    
}




- (void)emptySelector:(UIGestureRecognizer *)gestureRecognizer {
    NSLog(@"emptySelector");
}

- (BOOL)gestureRecognizerShouldBegin:(UIGestureRecognizer *)gestureRecognizer{
    return YES;
}


-(BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer
shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer
                                                    *)otherGestureRecognizer {
    return YES;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch{
    return YES;
}


- (void)queryPen:(CDVInvokedUrlCommand*)command
{
    NSLog(@"queryPen");
    CDVPluginResult* pluginResult = nil;
    T1PogoPen *pen;
    NSString* result;
    
    
    if ( [pogoManager.activePens count] >= 1 )
    {
        pen = [pogoManager.activePens objectAtIndex:0];
        result = [NSString stringWithFormat:@"{\"timestamp\":%f,\"hash\":%i,\"x\":%f,\"y\":%f,\"pressure\":%f,\"connected\":true}", pen.lastMovementTimestamp, pen.hash, pen.lastPoint.x, pen.lastPoint.y,pen.lastPressure];
    }
    else {
        result = @"{\"timestamp\":0,\"hash\":undefined,\"x\":NaN,\"y\":NaN,\"pressure\":1,\"connected\":false}";
    }
    
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:result];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void)setPenLEDColor:(CDVInvokedUrlCommand*)command {
    
    NSLog(@"setLEDColor");
    NSString* red = [command.arguments objectAtIndex:0];
    NSString* green = [command.arguments objectAtIndex:1];
    NSString* blue = [command.arguments objectAtIndex:2];
    
    CGFloat r = [red floatValue]/255.0f;
    CGFloat g = [green floatValue]/255.0f;
    CGFloat b = [blue floatValue]/255.0f;
    
    NSLog(@"%f %f %f", r,g,b);
    UIColor* penColor = [UIColor colorWithRed:r green:g blue:b alpha:1.0];
    [pogoManager fadeToLEDColor:penColor overTime:0.15f forDuration:2.0f];
    
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"OK"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}


- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnect::touchesBegan");
    for (UITouch *touch in touches) {
		//		NSLog(@"type: %d, time: %f",[pogoManager typeForTouch:touch],touch.timestamp);
		// touchIsPen: method clocked at about 15us
		if ([pogoManager touchIsPen:touch]) {
            
            
            //NSLog(@"it's a pen!");
            
            CGPoint location = [touch locationInView:self.webView];
            
            NSString* script = [NSString stringWithFormat:@"window.pogoConnect.penTouchBegin({timestamp:%f,hash:%i,x:%f,y:%f,pressure:%f});", touch.timestamp, touch.hash, location.x, location.y,[pogoManager pressureForTouch:touch]];
            [self.webView stringByEvaluatingJavaScriptFromString:script];
            
//			[drawingController drawTouchBeganWithPoint:[touch locationInView:drawingController.drawingView] pressure:[pogoManager pressureForTouch:touch] timestamp:touch.timestamp];
		}
	}
}


- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnect::touchesMoved");

    for (UITouch *touch in touches) {
		if ([pogoManager touchIsPen:touch]) {
            //NSLog(@"it's a pen!");
            
            CGPoint location = [touch locationInView:self.webView];
            
            NSString* script = [NSString stringWithFormat:@"window.pogoConnect.penTouchMove({timestamp:%f,hash:%i,x:%f,y:%f,pressure:%f});", touch.timestamp, touch.hash, location.x, location.y,[pogoManager pressureForTouch:touch]];
            [self.webView stringByEvaluatingJavaScriptFromString:script];
             
            //			[drawingController drawTouchMovedWithPoint:[touch locationInView:drawingController.drawingView] pressure:[pogoManager pressureForTouch:touch] timestamp:touch.timestamp];
		}
	}
}


- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnect::touchesEnded");
    
	for (UITouch *touch in touches) {
		if ([pogoManager touchIsPen:touch]) {
            //NSLog(@"it's a pen!");
            
            NSString* script = [NSString stringWithFormat:@"window.pogoConnect.penTouchEnd({timestamp:%f,hash:%i,force:0});", touch.timestamp, touch.hash];
            [self.webView stringByEvaluatingJavaScriptFromString:script];
//			[drawingController drawTouchEndedWithTimestamp:[event timestamp]];
		}
	}
}


- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnect::touchesCancelled");
}







// T1PogoManager Delegate Methods


// didDiscoverNewPen: is a good opportunity to help your user skip the step of manually connecting the first time.
// this will fire once per app launch if an unknown new pen is discovered.
// We hope you have a nicer UI in mind than UIAlertView.  This is only an example.  Use connectPogoPen: to make the connection.
// After it's connected once, it'll automatically connect thereafter unless autoconnect is disabled by your user.
// Incidentally, there is a good reason to ask the user istead of just connecting.
// In a room full of pens and people with your app, they'd get all jumbled up.

- (void)pogoManager:(T1PogoManager *)manager didDiscoverNewPen:(T1PogoPen *)pen withName:(NSString *)name {
	NSLog(@"didDiscoverNewPen");
    newlyDiscoveredPen = pen;	// retain this if not using ARC
    [newlyDiscoveredPen retain];
	UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"New Pen Found" message:[NSString stringWithFormat:@"Would you like to start using %@?",name] delegate:self cancelButtonTitle:@"No" otherButtonTitles:@"OK", nil];
	[alertView show];
}
- (void)alertView:(UIAlertView *)alertView didDismissWithButtonIndex:(NSInteger)buttonIndex {
	if (buttonIndex == 1) {
		[pogoManager connectPogoPen:newlyDiscoveredPen];
	}
    [newlyDiscoveredPen release];
}
- (void)pogoManager:(T1PogoManager *)manager willConnectPen:(T1PogoPen *)pen {
	NSLog(@"will connect pen (app): %@",pen.peripheral.productName);
    
    
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.penConnecting    ();"];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
	
}
- (void)pogoManager:(T1PogoManager *)manager didConnectPen:(T1PogoPen *)pen {
	NSLog(@"did connect pen (app): %@",pen.peripheral.productName);
    
    
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.penConnect();"];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
    
    
   /// pen.peripheral.manufacturerName
    
	//[debugLabel setText:pen.peripheral.manufacturerName];
	//[penConnected setHidden:NO];
	
	// this is a great place to choose the desired pressure response, linear, light, or heavy.
	// it defaults to linear.  This is just here as an example.
	// consider if T1PogoPenPressureResponseLight is best for artistic apps.
	//[manager setPressureResponse:T1PogoPenPressureResponseLinear forPen:pen];
}

- (void)pogoManager:(T1PogoManager *)manager didDisconnectPen:(T1PogoPen *)pen {
	NSLog(@"did disconnect pen (app)");
    
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.penDisconnect();"];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
    
	//[debugLabel setText:@"Pen has disconnected"];
	//[penConnected setHidden:YES];
	//[penTipDown setHidden:YES];
	//[penButtonDown setHidden:YES];
}

- (void)pogoManager:(T1PogoManager *)manager didUpdatePen:(T1PogoPen *)pen {
	NSLog(@"Pen Update: %@",pen.peripheral.manufacturerName);
	//[debugLabel setText:[NSString stringWithFormat:@"%@ - %@",pen.peripheral.manufacturerName, pen.peripheral.productName]];
}

- (void)pogoManager:(T1PogoManager *)manager didChangePressureWithoutMoving:(T1PogoEvent *)event forPen:(T1PogoPen *)pen {
    
    
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.pressureChange(%f);", [pen lastPressure]];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
    
	//	NSLog(@"pressureVal: %f",[pen lastPressure]);
	//[drawingController drawTouchChangedPressure:event.pressure timestamp:event.firstTimestamp];
}

- (void)pogoManager:(T1PogoManager *)manager didChangeTouchType:(T1PogoEvent *)event forPen:(T1PogoPen *)pen {
	//	NSLog(@"type change to %d from %d",event.touchType, event.previousTouchType);
	
	if ((event.touchType == T1TouchTypePen1 && event.previousTouchType == T1TouchTypeUnknown) ||
        (event.touchType == T1TouchTypePen1 && event.previousTouchType == T1TouchTypeFinger))
	{
		NSLog(@"Unknown touch becomes a Pen -- Start drawing");
        
        CGPoint location = [event.touch locationInView:self.webView];
        
        NSString* script = [NSString stringWithFormat:@"window.pogoConnect.penTouchBegin({timestamp:%f,hash:%i,x:%f,y:%f,pressure:%f});", [pen lastMovementTimestamp], [pen hash], location.x, location.y,[pogoManager pressureForTouch:event.touch]];
        [self.webView stringByEvaluatingJavaScriptFromString:script];
        
        
        
        
		// this drawing command is important because if this is a quick tap, no further messages may be received, so we should draw now.
		//[drawingController drawTouchMovedWithPoint:[event.touch locationInView:drawingController.drawingView] pressure:[pogoManager pressureForTouch:event.touch] timestamp:event.timestamp];
	}
	
	if (event.touchType == T1TouchTypeFinger && event.previousTouchType == T1TouchTypePen1 )
	{
		// stop drawing with this touch and undo the stroke.  it is definitely not a pen.
		NSLog(@"Pen becomes a Finger -- Undo stroke");
		
	}
	if (event.touchType == T1TouchTypeUnknown && event.previousTouchType == T1TouchTypePen1 )
	{
		// stop drawing with this touch and undo the stroke.  it is definitely not a pen.
		NSLog(@"Pen becomes Unknown -- Undo stroke");
		
	}
}

- (void)pogoManager:(T1PogoManager *)manager didDetectButtonDown:(T1PogoEvent *)event forPen:(T1PogoPen *)pen {
	NSLog(@"button %d down (app)",event.button);
    
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.buttonDown(%d);", event.button];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
    
	//[debugLabel setText:[NSString stringWithFormat:@"button %d is down", event.button]];
	//[penButtonDown setHidden:NO];
}

- (void)pogoManager:(T1PogoManager *)manager didDetectButtonUp:(T1PogoEvent *)event forPen:(T1PogoPen *)pen {
	NSLog(@"button %d up (app)",event.button);
    
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.buttonUp(%d);", event.button];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
    
	//[debugLabel setText:[NSString stringWithFormat:@"button %d is up", event.button]];
	//[penButtonDown setHidden:YES];
	
}

- (void)pogoManager:(T1PogoManager *)manager didDetectTipDown:(T1PogoEvent *)event forPen:(T1PogoPen *)pen {
    NSLog(@"tip down (app)");

    CGPoint location = [event.touch locationInView:self.webView];
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.tipDown({timestamp:%f,hash:%i,x:%f,y:%f,pressure:%f});", [pen lastMovementTimestamp], [pen hash], location.x, location.y, [pen lastPressure]];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
    
	//[debugLabel setText:[NSString stringWithFormat:@"tip is down"]];
	//[penTipDown setHidden:NO];
	
}

- (void)pogoManager:(T1PogoManager *)manager didDetectTipUp:(T1PogoEvent *)event forPen:(T1PogoPen *)pen {
		NSLog(@"tip up (app)");
    
    CGPoint location = [event.touch locationInView:self.webView];
    NSString* script = [NSString stringWithFormat:@"window.pogoConnect.tipUp({timestamp:%f,hash:%i,x:%f,y:%f,pressure:%f});", [pen lastMovementTimestamp], [pen hash], location.x, location.y,[pen lastPressure]];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
    
	//[debugLabel setText:[NSString stringWithFormat:@"tip is up"]];
	//[penTipDown setHidden:YES];
	
}



- (void)pogoManager:(T1PogoManager *)manager didChangeDebugString:(NSString *)string {
	//[debugLabel setText:string];
}

- (void)pogoManager:(T1PogoManager *)manager didDetectLowBatteryForPen:(T1PogoPen *)pen {
	NSLog(@"Low Battery - replace soon");
    
    NSString* script = [NSString stringWithFormat:@"lowBattery();"];
    [self.webView stringByEvaluatingJavaScriptFromString:script];
}


- (void)pogoManagerDidSuggestDisablingGesturesForRegisteredViews:(T1PogoManager *)manager
{
	NSLog(@"-- DISABLE NAVIGATION GESTURES --");
	//[self removePinchGesture];
	//[self removeSwipeGesture];
}

- (void)pogoManagerDidSuggestEnablingGesturesForRegisteredViews:(T1PogoManager *)manager
{
	NSLog(@"-- ENABLE NAVIGATION GESTURES --");
	//[self addPinchGesture];
	//[self addSwipeGesture];
}

@end

/*	Usage Instructions:

 Drag the T1PogoManager folder into your XCode project.

 1) #import "T1PogoManager.h into your view controller header and declare <T1PogoDelegate> protocol.  Add CoreBluetooth.framework and AVFoundation.framework to your build phases.

 2) When your app starts, call  'self.pogoManager = [T1PogoManager pogoManagerWithDelegate:self];'  This property should be retained for later use.
	We highly recommend calling self.pogoManager.enablePenInputOverNetworkIfIncompatiblePad = YES for compatibility with iPads 1 and 2.

 3) Register any views that receive pen events by calling [self.pogoManager registerView:view];

 4) Make sure multipleTouchEnabled = YES; for any views that will accept a pen.

 6) Make connection effortless for your users.  Listen for the pogoManager:didDiscoverNewPen:withName: delegate, the connect the pen up for them.  Here's how:
 newlyDiscoveredPen = pen;
 UIAlertView * alertView = [[UIAlertView alloc] initWithTitle:@"New Pen Found" message:[NSString stringWithFormat:@"Would you like to start using %@?",name] delegate:self cancelButtonTitle:@"No" otherButtonTitles:@"OK", nil];
 [alertView show];

 When the UIAlert returns with buttonIndex == 1, call [self.pogoManager connectPogoPen:].  After connecting once, the pen will automatically connect thereafter.  There is sample code you can cut/paste in the demo project.  You can also do something way cooler than a UIAlertView.  Maybe even something non-modal.

 5) Create a button for managing pens somewhere in your settings.  When the button is pressed, call something like:
 UIPopoverController * popover = [self.pogoManager scanningPopover];
 [popover presentPopoverFromRect:[sender frame] inView:self.view permittedArrowDirections:UIPopoverArrowDirectionRight animated:YES];

 This will show a UI for connecting/disconnecting and configuring pens.  Of course, it's fine to do your own UI using didDiscoverPeripheral and didUpdatePeripheral.

 6) When you handle touches, call [self.pogoManager touchIsPen:touch], [self.pogoManager pressureForTouch:touch], or [self.pogoManager typeForTouch:touch] as needed.  These all return extremely fast.

 7) In some cases, the type of touch can change.  If you're doing palm rejection, we recommend you implement the pogoManager:didChangeTouchType:forPen: delegate method to handle any change.  Compare pogoEvent.touchType with pogoEvent.previousTouchType.  If a touch changes from a pen type to an unknown or finger touch, stop and undo the stroke.

 8) Many apps use gestures to control pan, zoom, and undo.  However, gestures can be accidentally triggered with a resting palm.  This SDK can tell you when to disable gestures, allowing users to rest their hand on the iPad.  On Disable, cancel any gestures in progress.  Stop new gestures from happening.  Look for pogoManagerDidSuggestDisablingGesturesForRegisteredViews: and pogoManagerDidSuggestEnablingGesturesForRegisteredViews:
 
 
 
 For more usage info and examples, delve into the T1PogoManagerDemo project.
 Support requests may be emailed to devs@tenonedesign.com
 Follow @tenonedesign for SDK update notifications.
 Have fun!

 */



#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "T1PogoEvent.h"
#import "T1PogoPen.h"
#import "T1Peripheral.h"
#import "T1PogoDelegate.h"



@class T1PogoPenConnectionManager;



@interface T1PogoManager : NSObject

@property ( assign, readonly )	NSUInteger             buildNumber;                                // library build number (read only)
@property ( nonatomic, assign )	__unsafe_unretained id delegate;                                   // already set by pogoManagerWithDelegate:
@property ( assign )			BOOL                   autoConnectToAnyT1Peripheral;               // connects without asking.  Not recommended.
@property ( nonatomic, assign )	BOOL                   enablePenInputOverNetworkIfIncompatiblePad; // Turn on compatibility for iPads 1 & 2.  Highly recommended!



/*
 Required methods
 */
+ ( T1PogoManager * ) pogoManagerWithDelegate:( id )theDelegate;
- ( void ) registerView:( UIView * )view;
- ( void ) showLocatePenButton:( BOOL )decision;



/*
 Optionally obtain popover controller to allow connection of pens.
 Display with presentPopoverFromRect:inView:permittedArrowDirections:animated:
 You may also obtain just the view controller for pushing onto your own nav stack.
 */
- ( UIPopoverController * ) scanningPopover;
- ( UITableViewController * ) scanningViewController;
- ( void ) showScanningModal;



/*
 Pen & touch information methods.  Call these in your touches down/moved/ended methods.
 */
/*
 touchIsPen is an easy way to do palm rejection.  it it's ever wrong, it will correct itself with didChangeType: callback.
 pressure for touch provides a pressure value between 0 and 1.
 */
- ( BOOL ) touchIsPen:( UITouch * )touch;
- ( float ) pressureForTouch:( UITouch * )touch;


// A pen can have many types (different brush types, colors, or it can be an eraser).
// Call this if you care, otherwise touchIsPen: should suffice.
- ( T1PogoTouchType ) typeForTouch:( UITouch * )touch;

// Obtain all known extended information about a touch event, including pressure, pen type, etc.
// For details, see T1PogoEvent.h
- ( T1PogoEvent * ) pogoEventForTouch:( UITouch * )touch;



/*
 LED control methods
 */
// Set LED color for all connected pens.  Duration for all methods is in seconds.  Max duration is 12.75s.
- ( void ) setLEDColor:( UIColor * )color duration:( NSTimeInterval )duration;
- ( void ) setLEDColor:( UIColor * )color forPen:( T1PogoPen * )pen duration:( NSTimeInterval )duration;



// Fade to LED color for all connected pens with animation time, and scheduled shut-off after duration.  Duration includes fade time.
- ( void ) fadeToLEDColor:( UIColor * )color overTime:( NSTimeInterval )time forDuration:( NSTimeInterval )duration;
- ( void ) fadeToLEDColor:( UIColor * )color forPen:( T1PogoPen * )pen overTime:( NSTimeInterval )time forDuration:( NSTimeInterval )duration;



/*
 Pressure response control
 By default, the pen pressure is linear, but can be changed to light or heavy.
 Artistic apps might consider if T1PogoPenPressureResponseLight is a good option.
 */
- ( void ) setPressureResponse:( T1PogoPenPressureResponse )pressureResponse forPen:( T1PogoPen * )pen;



/*
 Methods for implementing your own pen scanning interface if you're really into that
 Implement didDiscoverPeripheral: and didUpdatePeripheral: delegate methods to see peripheral data
 The following methods can be used to control those peripherals
 Scanning always runs in the background, but calling startScan: will temporarily increase scanning rate
 */
- ( void ) connectPeripheral:( T1Peripheral * )peripheral;
- ( void ) disconnectPeripheral:( T1Peripheral * )peripheral;
- ( void ) setEnableLocatorBeacon:( BOOL )enable forPeripheral:( T1Peripheral * )peripheral;
- ( void ) setEnableAutoconnect:( BOOL )enable forPeripheral:( T1Peripheral * )peripheral;
- ( void ) startScan:( id )sender;



/*
 The didDiscoverNewPen:withName: delegate method is the best way to help your users connect their pen.
 Once you receive this message, retain the temporary pen object it provides, ask the user what to do,
 then call connectPogoPen:  After calling connectPogoPen, you may discard the temporary pen object.
 If you're curious, yes, it's also possible to call [pogoManager connectPeripheral:pen.peripheral];
 The other pen methods are here help you keep track of how many pens are connected.
 */
- ( void ) connectPogoPen:( T1PogoPen * )pen;
- ( void ) disconnectPogoPen:( T1PogoPen * )pen;
- ( BOOL ) oneOrMorePensAreConnected;
- ( NSArray * ) activePens;

@end

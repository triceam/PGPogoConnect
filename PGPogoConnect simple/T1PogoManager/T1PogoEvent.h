#import <Foundation/Foundation.h>




typedef enum                            // The event types
{
    T1PogoEventTypeUnknown			= 0 // should never happen
	, T1PogoEventTypeButtonDown         = 1 // a button was pressed down
	, T1PogoEventTypeButtonUp			= 2 // a button was released
	, T1PogoEventTypePressureChange     = 3 // pressure data did change
	, T1PogoEventTypeTouchTypeChange	= 4 // touch type did change
	, T1PogoEventTypeExtendedData		= 5 // extended data for UITouch
	, T1PogoEventTypeTipDown			= 6 // only for advanced use
	, T1PogoEventTypeTipUp              = 7 // only for advanced use
} T1PogoEventType;



typedef enum                            // Describes what is touching the display
{
    T1TouchTypeUnknown				= 0 // type of touch is unknown
	, T1TouchTypeFinger                 = 1 // touch is a finger or a palm
	, T1TouchTypeEraser                 = 2 // touch is eraser
	, T1TouchTypePen1					= 3 // touch is pen type 1
	, T1TouchTypePen2					= 4 // touch is pen type 2
	, T1TouchTypePen3					= 5 // touch is pen type 3
	, T1TouchTypePen4					= 6 // touch is pen type 4
	, T1TouchTypePen5					= 7 // touch is pen type 5
} T1PogoTouchType;



typedef enum                            // Possible button numbers for devices with lots of buttons
{
    T1PogoButton1                     = 0 // first, and usually the only button
	, T1PogoButton2                     = 1 // a second button, and so on
	, T1PogoButton3                     = 2
	, T1PogoButton4                     = 3
	, T1PogoButton5                     = 4
	, T1PogoButton6                     = 5
	, T1PogoButton7                     = 6
	, T1PogoButton8                     = 7
} T1PogoButton;



@interface T1PogoEvent : NSObject
{
	id __unsafe_unretained touch;               // a back-pointer to the associated UITouch object
	id __unsafe_unretained pen;                 // the pen this event came from
	T1PogoEventType        type;				// why this event is being delivered
	BOOL                   isPen;               // shortcut to find if it's a pen of any type (including erase, type>1)
	T1PogoTouchType        touchType;			// what type of touch this is associated with
	T1PogoTouchType        previousTouchType;	// what type of touch this used to be
	T1PogoButton           button;				// which button
	float                  pressure;            // pressure change for associated UIEvent object
	NSTimeInterval         firstTimestamp;		// first time this touch has been seen
	BOOL				   shouldParticipateInGestures;		// NO if we think this is a palm that shouldn't participate in app gestuers like pan/zoom

}

@property ( assign )                            id              touch;
@property ( assign )                            id              pen;
@property ( assign )                            T1PogoEventType type;
@property ( nonatomic, assign, getter = isPen ) BOOL            isPen;
@property ( nonatomic, assign )                 T1PogoTouchType touchType;
@property ( assign )                            T1PogoTouchType previousTouchType;
@property ( assign )                            T1PogoButton    button;
@property ( assign )                            float           pressure;
@property ( assign )                            NSTimeInterval  timestamp;
@property ( assign )                            NSTimeInterval  firstTimestamp;
@property (	assign )							BOOL			shouldParticipateInGestures;

@end

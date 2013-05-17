#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "T1PogoEvent.h"



@class T1AverageValue;
@class T1Peripheral;



#define kPogoPenInitialPressure                 0.05f
#define kPogoPenStationaryDesignationDuration   0.020f



typedef struct penCapabilities
{
	unsigned touchDetect:           1;
	unsigned pressure:              1;
	unsigned led:                   1;
	unsigned multicolorLed:         1;
	unsigned button:                1;
	unsigned multibutton:           1;
	unsigned multitip:              1;	// hint that there's another logical pen on this peripheral
	unsigned extendedPressureRange: 1;
	unsigned tilt:                  1;
	unsigned tangental:             1;
	unsigned rotation:              1;
	unsigned z:                     1;
	unsigned isFirmwareUpdatable:   1;

} penCapabilities;

typedef enum
{
    T1PogoPenPressureResponseLinear	= 0 // standard linear response (default)
	, T1PogoPenPressureResponseLight	= 1 // medium pressure results in lighter stroke
	, T1PogoPenPressureResponseHeavy	= 2 // medium pressure results in heavier stroke
} T1PogoPenPressureResponse;



@interface T1PogoPen : NSObject

@property ( unsafe_unretained )             T1Peripheral __unsafe_unretained * peripheral;
@property ( assign )                        BOOL                               isConnected;
@property ( assign )                        NSTimeInterval                     connectionTimestamp;
@property ( strong , nonatomic )            CBService                        * parentService;
@property ( assign )                        T1PogoTouchType                    type;
@property ( assign , readonly )             penCapabilities                  * capabilitiesBitfield;
@property ( assign , readonly )             NSUInteger                         numberOfButtons;
@property ( strong , nonatomic )            UIColor                          * LEDColor;
@property ( strong , nonatomic, readonly )  UIColor                          * penBodyColor;	// may not be accurate
@property ( assign )                        float                              lastPressure;
@property ( assign )                        CGPoint                            lastPoint;
@property ( assign )                        BOOL                               tipIsDown;
@property ( assign )                        BOOL                               tipIsStationary;
@property ( assign )                        BOOL                               tipIsDownInRegisteredView;
@property ( assign )                        BOOL                               usePressureSmoothing;
@property ( assign )                        NSTimeInterval                     lastMovementTimestamp;
@property ( assign )                        NSTimeInterval                     lastTipDownTimestamp;
@property ( assign )                        T1PogoPenPressureResponse          pressureResponse;

+ ( id ) pogoPenForService:( CBService * )service;
- ( void ) resetPressureAverage;

@end

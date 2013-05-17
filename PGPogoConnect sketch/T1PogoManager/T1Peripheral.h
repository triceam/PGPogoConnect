#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>



@interface T1Peripheral : NSObject

@property ( strong, nonatomic )            NSString                         * productName;
@property ( strong, nonatomic )            NSString                         * modelNumber;
@property ( strong, nonatomic )            NSString                         * manufacturerName;
@property ( strong, nonatomic )            NSString                         * uniqueID;
@property ( strong, nonatomic )            NSString                         * firmwareVersion;
@property ( strong, nonatomic )            NSString                         * hardwareVersion;
@property ( strong, nonatomic )            NSString                         * softwareVersion;
@property ( assign, nonatomic )            NSInteger                          batteryLevel;
@property ( assign, nonatomic )            NSTimeInterval                     connectionTimestamp;
@property ( assign, nonatomic )            NSTimeInterval                     firstDiscoveryTimestamp;
@property ( assign, nonatomic )            NSUInteger                         recentAdvertisingCount;
@property ( unsafe_unretained, nonatomic ) CBPeripheral __unsafe_unretained * parentPeripheral;
@property ( strong, readonly, nonatomic )  NSArray                          * pens;
@property ( assign, nonatomic )            BOOL                               shouldPromptToConnect;
@property ( assign, nonatomic )            BOOL                               discoveryComplete;
@property ( assign, nonatomic )            BOOL                               autoconnectEnabled;
@property ( assign, nonatomic )            BOOL                               locatorBeaconEnabled;
@property ( assign, nonatomic )            NSTimeInterval                     lastDiscoveryTimestamp;
@property ( assign, nonatomic )            NSTimeInterval                     lastLocatorBeaconTimestamp;
@property ( assign, readonly, nonatomic )  BOOL                               isRecognized;
@property ( assign, readonly, nonatomic )  BOOL                               isConnected;
@property ( assign, nonatomic )            BOOL                               isBeingConnected;
@property ( assign, nonatomic )            BOOL                               isAdvertising;
@property ( assign, nonatomic )            BOOL                               isLocatable; // if a beacon has been received recently
@property ( assign, nonatomic )            BOOL                               isBridged;   // connected through an iPhone 4s or later
@property ( assign, nonatomic )            BOOL                               isShared;
@property ( strong, nonatomic )            NSNumber                         * RSSI;

- ( NSString * ) batteryPercentString;

@end

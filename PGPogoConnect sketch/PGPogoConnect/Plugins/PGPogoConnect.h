//
//  PGPogoConnect.h
//  PGPogoConnect
//
//  Created by Andrew Trice on 4/5/13.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import "PGPogoConnectGestureRecognizer.h"


@class T1PogoManager;
@class T1PogoPen;
@class T1PogoNetClient;


@interface PGPogoConnect : CDVPlugin <UIGestureRecognizerDelegate>
{

    T1PogoManager           * pogoManager;
    T1PogoNetClient         * netClient;
	T1PogoPen               * newlyDiscoveredPen;
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event;
- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event;
- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event;
- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event;

@end

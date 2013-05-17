//
//  PGPogoConnectGestureRecognizer.h
//  PGPogoConnect
//
//  Created by Andrew Trice on 4/5/13.
//
//

#import <UIKit/UIKit.h>

@class PGPogoConnect;

@interface PGPogoConnectGestureRecognizer : UIGestureRecognizer
{
    PGPogoConnect * pgPogoConnect;
}


- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event;

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event;

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event;

- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event;

@end

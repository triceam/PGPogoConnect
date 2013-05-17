//
//  PGPogoConnectGestureRecognizer.m
//  PGPogoConnect
//
//  Created by Andrew Trice on 4/5/13.
//
//

#import "PGPogoConnectGestureRecognizer.h"

@implementation PGPogoConnectGestureRecognizer

- (id)initWithTarget:(id)target action:(SEL)action {
    NSLog(@"PGPogoConnectGestureRecognizer::initWithTarget");
    return [super initWithTarget:target action:action];
}





- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnectGestureRecognizer::touchesBegan");
    
    PGPogoConnect *pogoConnect = ((PGPogoConnect *) self.delegate);
    [pogoConnect touchesBegan:touches withEvent:event];
}


- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnectGestureRecognizer::touchesMoved");
    
    PGPogoConnect *pogoConnect = ((PGPogoConnect *) self.delegate);
    [pogoConnect touchesMoved:touches withEvent:event];
}


- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnectGestureRecognizer::touchesEnded");
    
    PGPogoConnect *pogoConnect = ((PGPogoConnect *) self.delegate);
    [pogoConnect touchesEnded:touches withEvent:event];
}


- (void)touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    //NSLog(@"PGPogoConnectGestureRecognizer::touchesCancelled");
    
    PGPogoConnect *pogoConnect = ((PGPogoConnect *) self.delegate);
    [pogoConnect touchesBegan:touches withEvent:event];
}

@end

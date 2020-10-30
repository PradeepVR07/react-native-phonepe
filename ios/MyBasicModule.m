//
//  MyBasicModule.m
//  PhonePe
//
//  Created by Pradeep Aricent on 28/10/20.
//

#import <Foundation/Foundation.h>
//#import <React/RCTBridgeModule.h>
#import "RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(MyBasicModule, NSObject)
RCT_EXTERN_METHOD(ShowMessage:(NSString *)message duration:(double *)duration)
@end

//
//  AJASafariViewController.h
//  AjAReact
//
//  Created by 林满佳 on 16/6/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <RCTBridge.h>
#import <SafariServices/SafariServices.h>

@interface AJASafariViewController : NSObject<RCTBridgeModule, SFSafariViewControllerDelegate>

@end

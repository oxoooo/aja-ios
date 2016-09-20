//
//  AJASafariViewController.m
//  AjAReact
//
//  Created by 林满佳 on 16/6/20.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AJASafariViewController.h"

@implementation AJASafariViewController

RCT_EXPORT_MODULE()
RCT_EXPORT_METHOD(presentSafari:(NSString *)url) {
  NSLog(@"Presenting with url %@", url);
  
  SFSafariViewController *safariViewController = [[SFSafariViewController alloc]
                                                  initWithURL:[NSURL URLWithString:url]
                                                  entersReaderIfAvailable:YES];
  UIColor *color = [UIColor colorWithRed:0.13 green:0.85 blue:0.68 alpha:1.0];
  [safariViewController.view setTintColor: color];
  
  safariViewController.delegate = self;
  
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootViewController = [[
                                             [UIApplication sharedApplication] keyWindow] rootViewController];
    
    [rootViewController presentViewController:safariViewController animated:YES completion: nil];
  });
}

-(void) safariViewControllerDidFinish:(nonnull SFSafariViewController *)controller {
  UIViewController *rootViewController = [
                                          [[UIApplication sharedApplication] keyWindow] rootViewController];
  
  [rootViewController dismissViewControllerAnimated:YES completion:nil];
}

@end

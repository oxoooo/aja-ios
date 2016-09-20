//
//  AJAPoiSearchManager.h
//  AjAReact
//
//  Created by 林满佳 on 16/6/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "BaiduMapAPI_Search/BMKSearchComponent.h"
#import "RCTEventDispatcher.h"
#import "RCTEventEmitter.h"

@interface AJAPoiSearchManager : RCTEventEmitter<BMKPoiSearchDelegate>

@end

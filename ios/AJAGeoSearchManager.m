//
//  AJAGeoSearchManager.m
//  AjAReact
//
//  Created by 林满佳 on 16/6/21.
//  Copyright © 2016年 Facebook. All rights reserved.
//
// code 1 当在设置城市未找到结果，但在其他城市找到结果时，回调建议检索城市列表
// code 2 未找到结果
// code 3 检索发送成功

#import "AJAGeoSearchManager.h"

@implementation AJAGeoSearchManager
{
  BMKGeoCodeSearch *_search;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onReverseGeoSearchError",
           @"onReverseGeoCodeSearchResult"];
}

RCT_EXPORT_METHOD(init:(BOOL)code)
{
  if (_search == nil) {
    _search = [[BMKGeoCodeSearch alloc] init];
    __weak __typeof(self) weakSelf = self;
    _search.delegate = weakSelf;
  }
}

RCT_EXPORT_METHOD(searchReverse:(double)lat lng:(double)lng)
{
  BMKReverseGeoCodeOption *option = [[BMKReverseGeoCodeOption alloc] init];
  CLLocationCoordinate2D pt = (CLLocationCoordinate2D) {lat, lng};
  option.reverseGeoPoint = pt;
  BOOL flag = [_search reverseGeoCode:option];
  
  if (!flag) {
    [self sendEventWithName:@"onReverseGeoSearchError" body:@{@"code": @3}];
//    [self.bridge.eventDispatcher
//     sendAppEventWithName:@"onReverseGeoSearchError"
//     body:@{@"code": @3}];
  }

}

- (id) checkValue:(id)value {
  if (value == nil) {
    return [NSNull null];
  } else {
    return value;
  }
}

-(void)onGetReverseGeoCodeResult:(BMKGeoCodeSearch *)searcher result:(BMKReverseGeoCodeResult *)result errorCode:(BMKSearchErrorCode)error
{
  if (error == BMK_SEARCH_NO_ERROR) {
    
    BMKAddressComponent *address = [result addressDetail];
    
    NSDictionary *body = @{
                           @"streetNumber": [self checkValue:address.streetName],
                           @"streetName": [self checkValue:address.streetName],
                           @"district": [self checkValue:address.district],
                           @"city": [self checkValue:address.city],
                           @"province": [self checkValue:address.province]
                           };
    
//    [self.bridge.eventDispatcher
//     sendAppEventWithName:@"onReverseGeoCodeSearchResult"
//     body: body];
    [self sendEventWithName:@"onReverseGeoCodeSearchResult" body: body];
  } else {
//    [self.bridge.eventDispatcher
//     sendAppEventWithName:@"onReverseGeoSearchError"
//     body:@{@"code": @2}];
    [self sendEventWithName:@"onReverseGeoSearchError" body:@{@"code": @2}];
  }
}

@end

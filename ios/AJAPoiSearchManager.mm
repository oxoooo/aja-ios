//
//  AJAPoiSearchManager.m
//  AjAReact
//
//  Created by 林满佳 on 16/6/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//
// code 1 当在设置城市未找到结果，但在其他城市找到结果时，回调建议检索城市列表
// code 2 未找到结果
// code 3 检索发送成功

#import "AJAPoiSearchManager.h"

@implementation AJAPoiSearchManager
{
  BMKPoiSearch *_searcher;
}


RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onPoiSearchStart",
           @"onPoiSearchError",
           @"onPoiSearchResult"];
}

RCT_EXPORT_METHOD(init:(BOOL)code)
{
  if (_searcher == nil) {
    _searcher = [[BMKPoiSearch alloc] init];
    _searcher.delegate = self;
  }
}

RCT_EXPORT_METHOD(searchOnCity:(NSString *)city keyword:(NSString *)keyword)
{
  BMKCitySearchOption *option = [[BMKCitySearchOption alloc] init];
  option.city = city;
  option.keyword = keyword;
  BOOL flag = [_searcher poiSearchInCity:option];
  if (flag) {
    [self sendEventWithName:@"onPoiSearchStart"
                       body:@{@"city": city, @"keyword": keyword}];
  } else {
    [self sendEventWithName:@"onPoiSearchError"
                       body:@{@"code": @3}];
  }
}

- (id) checkValue:(id)value {
  if (value == nil) {
    return [NSNull null];
  } else {
    return value;
  }
}


- (void)onGetPoiResult:(BMKPoiSearch *)searcher result:(BMKPoiResult *)poiResult errorCode:(BMKSearchErrorCode)errorCode
{
  
  if (errorCode == BMK_SEARCH_NO_ERROR) {
    
    NSMutableArray *list = [[NSMutableArray alloc] init];
    NSArray *infoList = [poiResult poiInfoList];
    
    for (BMKPoiInfo *info in infoList) {
      
      NSString *name = [self checkValue:info.name];
      NSString *uid = [self checkValue:info.uid];
      NSString *city = [self checkValue:info.city];
      NSString *address = [self checkValue:info.address];
      NSString *phone = [self checkValue:info.phone];
      NSString *postcode = [self checkValue:info.postcode];
      NSNumber *epoitype = [NSNumber numberWithInt:info.epoitype];
      NSNumber *latitude = [NSNumber numberWithDouble:info.pt.latitude];
      NSNumber *longitude = [NSNumber numberWithDouble:info.pt.longitude];
      
      NSDictionary *data = @{
                             @"name": name,
                             @"uid": uid,
                             @"address": address,
                             @"city": city,
                             @"phone": phone,
                             @"postcode": postcode,
                             @"epoitype": epoitype,
                             @"latitude": latitude,
                             @"longitude": longitude
                             };
      [list addObject:data];      
    }
    
    [self sendEventWithName:@"onPoiSearchResult"
                       body: list];
  } else if (errorCode == BMK_SEARCH_AMBIGUOUS_KEYWORD) {
    [self sendEventWithName:@"onPoiSearchError"
                       body:@{@"code": @1}];
  } else {
    [self sendEventWithName:@"onPoiSearchError"
                       body:@{@"code": @2}];
  }
}

@end

//
//  AJASpeechManager.h
//  AjAReact
//
//  Created by 林满佳 on 16/6/7.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTEventDispatcher.h"
#import "RCTEventEmitter.h"

#ifndef DEBUG
#import "BDVoiceRecognitionClient.h"
#endif

#ifdef DEBUG
@interface AJASpeechManager : RCTEventEmitter
#else
@interface AJASpeechManager : RCTEventEmitter<MVoiceRecognitionClientDelegate>
#endif

@end

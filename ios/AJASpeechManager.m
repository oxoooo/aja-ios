//
//  AJASpeechManager.m
//  AjAReact
//
//  Created by 林满佳 on 16/6/7.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AJASpeechManager.h"

#define VOLUME_UPDATE_INTERVAL 0.1

@implementation AJASpeechManager
{
  NSTimer *volumeUpdateTimer;
}


RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onSpeechResults",
           @"onSpeechError",
           @"onSpeechEndOfSpeech",
           @"onSpeechBeginOfSpeech",
           @"onSpeechVolumeChanged"];
}


RCT_EXPORT_METHOD(init:(BOOL)code)
{
#ifndef DEBUG
  [[BDVoiceRecognitionClient sharedInstance] setApiKey:@"" withSecretKey:@""];
  [[BDVoiceRecognitionClient sharedInstance] setLanguage:EVoiceRecognitionLanguageChinese];
  [[BDVoiceRecognitionClient sharedInstance] setConfig:@"nlu" withFlag:YES];
#endif
}

RCT_EXPORT_METHOD(start:(BOOL)code)
{
#ifndef DEBUG
  [[BDVoiceRecognitionClient sharedInstance] cancelListenCurrentDBLevelMeter];
  if ([[BDVoiceRecognitionClient sharedInstance] isCanRecorder]) {
    [[BDVoiceRecognitionClient sharedInstance] listenCurrentDBLevelMeter];
    [[BDVoiceRecognitionClient sharedInstance] startVoiceRecognition:self];
  }
#endif
}

RCT_EXPORT_METHOD(stop:(BOOL)code)
{
  [self speakEnded];
#ifndef DEBUG
  [[BDVoiceRecognitionClient sharedInstance] stopVoiceRecognition];
#endif
}

-(void) updateVolumeBar:(id)sender
{
#ifdef DEBUG
  float volume = 1.0;
#else
  float volume = (float)[[BDVoiceRecognitionClient sharedInstance] getCurrentDBLevelMeter]/60;
  if (volume > 1.0) {
    volume = 1.0;
  }
#endif
  NSNumber *value = [NSNumber numberWithFloat:volume];
  [self sendEventWithName:@"onSpeechVolumeChanged" body:@{
                                                          @"volume": value,
                                                          }];
  NSLog(@"%f", volume);
}

- (void) meterTimer
{
  volumeUpdateTimer = [[NSTimer alloc] initWithFireDate:
                       [[NSDate alloc] initWithTimeIntervalSinceNow:VOLUME_UPDATE_INTERVAL]
                                               interval:VOLUME_UPDATE_INTERVAL
                                                 target:self
                                               selector:@selector(updateVolumeBar:) userInfo:nil
                                                repeats:YES];
  [[NSRunLoop currentRunLoop] addTimer: volumeUpdateTimer forMode: NSDefaultRunLoopMode];
}

- (void) VoiceRecognitionClientWorkStatus:(int)aStatus obj:(id)aObj
{
#ifndef DEBUG
  switch(aStatus) {
    case EVoiceRecognitionClientWorkStatusStartWorkIng:
      [self sendEventWithName:@"onSpeechBeginOfSpeech" body:@{}];
      [self meterTimer];
      break;
    case EVoiceRecognitionClientWorkStatusFlushData:
    {
      NSMutableString *tmpString = [[NSMutableString alloc] initWithString:@""];
      [tmpString appendFormat:@"%@",[aObj objectAtIndex:0]];
      [self sendEventWithName:@"onSpeechResults" body:@{
                                                        @"result": tmpString,
                                                        @"isLast": @(0)
                                                        }];
      break;
    }
    case EVoiceRecognitionClientWorkStatusFinish:
    {
      [self speakEnded];
      NSMutableString *sentenceString = [[NSMutableString alloc] initWithString:@""];
      for (NSArray *result in aObj) {
        NSDictionary *dic = [result objectAtIndex:0];
        NSString *candidateWord = [[dic allKeys] objectAtIndex:0];
        [sentenceString appendString:candidateWord];
      }
      NSLog(@"result: %@", sentenceString);
      [self sendEventWithName:@"onSpeechResults" body:@{
                                                        @"result": sentenceString,
                                                        @"isLast": @(1)
                                                        }];
      break;
    }
    case EVoiceRecognitionClientWorkStatusEnd:
      [self speakEnded];
      break;
    default:
    {
      break;
    }
  }
#endif
}

-(void) VoiceRecognitionClientErrorStatus:(int)aStatus subStatus:(int)aSubStatus
{
  [self sendEventWithName:@"onSpeechError"
                     body:@{
                            @"code": @(aStatus),
                            @"message": @(aSubStatus)
                            }];

  [self speakEnded];
}

- (void)speakEnded
{
  [self sendEventWithName:@"onSpeechEndOfSpeech" body:@{}];
  [self stopVolumeUpdate];
}

- (void)stopVolumeUpdate
{

  [volumeUpdateTimer invalidate];
#ifndef DEBUG
  [[BDVoiceRecognitionClient sharedInstance] cancelListenCurrentDBLevelMeter];
#endif
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

@end

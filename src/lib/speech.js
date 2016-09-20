/**
@flow
Don't forget to unsubscribe, typically in componentWillUnmount
subscription.remove();
onSpeechEndOfSpeech params: {}
onSpeechBeginOfSpeech params: {}
onSpeechVolumeChanged: params: {volume}
onSpeechError: params: {code, message}
onSpeechResults: params: {result, isLast:[0: false, 1: true]}
*/

import { NativeModules, NativeEventEmitter } from 'react-native';
const SpeechManager = NativeModules.AJASpeechManager;
const speechManager = new NativeEventEmitter(SpeechManager);

function cleanText (text: string): string {
  return text.replace(/ /g, '').replace(/[,.，。]$/, '');
}

export function init() {
  SpeechManager.init(true);
}

export function start() {
  SpeechManager.start(true);
}

export function stop() {
  SpeechManager.stop(true);
}

export interface Subscription {
  remove(): () => void
}

export function onResults(callback: (result: string, finish: boolean) => void) : Subscription {
  return speechManager.addListener('onSpeechResults', ({ result, isLast }) => {
    if (isLast == 1) {
      let value = cleanText(JSON.parse(result)['item'].join(''));
      callback(value, !!isLast);
    } else {
      callback(cleanText(result), !!isLast);
    }
  });
}

export function onVolumeChanged(callback: (volume: number) => void) : Subscription {
  return speechManager.addListener('onSpeechVolumeChanged', ({ volume }) => {
    callback(volume);
  });
}

export function onError(callback: (code: number, message: string) => void) : Subscription {
  return speechManager.addListener(
      'onSpeechError',
      (data) => {
        let {code, message} = data;
        callback(code, message);
      }
    );
}

export function onBegin(callback: () => void) : Subscription {
  return speechManager.addListener(
      'onSpeechBeginOfSpeech',
      () => callback(),
    );
}

export function onEnd(callback: () => void) : Subscription {
  return speechManager.addListener(
      'onSpeechEndOfSpeech',
      () => callback(),
    );
}

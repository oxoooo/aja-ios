// @flow
// code 2 未找到结果
// code 3 检索发送成功

import { NativeModules, NativeEventEmitter } from 'react-native';
const AJAGeoSearchManager = NativeModules.AJAGeoSearchManager;
const aJAGeoSearchManager = new NativeEventEmitter(AJAGeoSearchManager);

export interface Subscription {
  remove(): () => void
}

export type Address = {
  streetNumber: string, // 街道号码
  streetName: string, // 街道名称
  district: string, // 区县名称
  city: string, //城市名称
  province: string, // 省份名称
}

export function init() {
  AJAGeoSearchManager.init(true);
}

export function searchReverse(lat: number, lng: number) {
  AJAGeoSearchManager.searchReverse(lat, lng);
}

export function onResult(callback: (address: Address) => void): Subscription {
  return aJAGeoSearchManager.addListener(
    'onReverseGeoCodeSearchResult',
    (address) => callback(address)
  );
}

export function onError(callback: (code: number) => void): Subscription {
  return aJAGeoSearchManager.addListener(
    'onReverseGeoSearchError',
    (code) => callback(code)
  );
}

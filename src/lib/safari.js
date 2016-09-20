import { NativeModules } from 'react-native';

export default function openSafari(url) {
  const {AJASafariViewController} = require('NativeModules')
  AJASafariViewController.presentSafari(url)
}
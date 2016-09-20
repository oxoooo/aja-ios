import { AsyncStorage } from 'react-native';
import client from './client';

export function setUserToken(token) {
  let _token = Object.assign(token, {
    now: Math.floor(new Date() / 1000)
  });
  return AsyncStorage
    .setItem('USERTOKEN', JSON.stringify(_token))
    .then(() => {
      client.token = _token;
      return Promise.resolve(_token);
    });
}

export function getUserToken() {
  return AsyncStorage
    .getItem('USERTOKEN')
    .then(JSON.parse)
}

import type {
  Action,
  ThunkAction,
} from './types';

import { AsyncStorage } from 'react-native';

import client from '../lib/client';

export function logout(): ThunkAction {
  return (dispatch) => {
    dispatch(clear());
    client.logout().catch(e => console.warn(e));
  }
}

export function clear(): ThunkAction {
  return (dispatch) => {
    AsyncStorage.clear().then(() => dispatch({ type: 'LOGOUT' }));
  }
}

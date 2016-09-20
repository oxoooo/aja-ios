import {AsyncStorage} from 'react-native';
import {applyMiddleware, createStore, combineReducers} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import promise from './promise';
import array from './array';

import reducers from '../reducers';

import client from '../lib/client';

import * as login from '../actions/login';
import { STATE_SEND_CODE, STATE_VERIFIED } from '../actions/login';

let isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

let logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true,
});

let createAJAStore = applyMiddleware(thunk, promise, array, logger)(createStore);

export default function configureStore(onComplete) {
  // TODO(frantic): reconsider usage of redux-persist, maybe add cache breaker
  const store = autoRehydrate()(createAJAStore)(combineReducers(reducers));
  persistStore(store, {
    storage: AsyncStorage,
    blacklist: ['search', 'settings', 'app', 'session', 'conversation'],
  }, () => {
    client.init(() => {
      const state = client.token ? STATE_VERIFIED : STATE_SEND_CODE;
      store.dispatch(login.stateChange(state, null));
      onComplete();
    });
  });
  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

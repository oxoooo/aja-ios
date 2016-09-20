// @flow

import type { Action } from '../actions/types';
import type { App, Entry } from '../actions/app';

export type State = {
  created: boolean,
  app: ?App,
  entry: ?Entry,
};

const initialState: State = {
  created: false,
  app: null,
  entry: null,
};

export default function app(state: State = initialState, action: Action): State {
  if (action.type === 'APP_CREATE') {
    return {
      ...state,
      created: true,
    }
  }

  if (action.type === 'APP_UPDATE') {
    return {
      ...state,
      app: action.app,
      entry: action.entry,
    }
  }

  return state;
}

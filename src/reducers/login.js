// @flow

import type { Action } from '../actions/types';

import { STATE_SEND_CODE } from '../actions/login';

export type State = {
  state: number,
  error: ?Error,
};

const initialState: State = {
  state: STATE_SEND_CODE,
  error: null,
};

export default function user(state: State=initialState, action: Action): State {
  if (action.type === 'LOGIN_STATE') {
    return {
      ...state,
      state: action.state,
      error: action.error,
    }
  }

  if (action.type === 'LOGOUT') {
    return {
      ...state,
      state: STATE_SEND_CODE,
      error: null,
    }
  }

  return state;
}

// @flow

import type {
  Action,
  ThunkAction
} from './types';

import client from '../lib/client';

import {
  setUserToken
} from '../lib/token';

export const STATE_SEND_CODE = 0;
export const STATE_SENDING = 1;
export const STATE_SEND_FAILED = 2;
export const STATE_VERIFY = 3;
export const STATE_VERIFYING = 4;
export const STATE_VERIFY_FAILED = 5;
export const STATE_VERIFIED = 6;

export function sendCode(phone: string): ThunkAction {
  return async function (dispatch) {
    dispatch(stateChange(STATE_SENDING));

    try {
      await client.sendPhone(phone);
      dispatch(stateChange(STATE_VERIFY));
    } catch (e) {
      dispatch(stateChange(STATE_SEND_FAILED, e));
    }
  }
}

export function login(phone: string, code: string): ThunkAction {
  return async function (dispatch) {
    dispatch(stateChange(STATE_VERIFYING));

    try {
      const token = await client.login(phone, code);
      await setUserToken(token);
      client.token = token;
      dispatch(stateChange(STATE_VERIFIED));
    } catch (e) {
      dispatch(stateChange(STATE_VERIFY_FAILED, e));
    }
  }
}

export function stateChange(state: number, error: Error = null): Action {
  return {
    type: 'LOGIN_STATE',
    state, error,
  }
}

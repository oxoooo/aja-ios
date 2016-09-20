// @flow

import type {
  Action,
  ThunkAction
} from './types';

import client from '../lib/client';
import interaction from '../lib/interaction';

import * as logout from './logout'

function ensureLoggedIn(status: ?number, dispatch: (action: ThunkAction) => void) {
  if (status === 401) {
    dispatch(logout.clear());
  }
}

export function index(): ThunkAction {
  return (dispatch) => {
    client.indexSetting()
      .then(interaction)
      .then((settings) => dispatch({
        type: 'SETTINGS_INDEX',
        settings
      }))
      .catch(e => {
        console.warn('get settings error', e);
        dispatch(error(e, '暂时无法获取设置列表，请稍后再试'));
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

export function destroy(id: string): ThunkAction {
  return (dispatch) => {
    client.delSetting(id)
      .then(client.indexSetting)
      .then(interaction)
      .then(settings => dispatch({
        type: 'SETTINGS_INDEX',
        settings
      }))
      .catch(e => {
        console.warn('destroy setting error', e);
        dispatch(error(e, '暂时无法删除这个设置，请稍后再试'));
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

export function setIsLoading(isLoading: boolean): Action {
  return {
    type: 'SET_IS_LOADING',
    isLoading,
  }
}

export function error(error: ?Error, message: ?string): Action {
  return {
    type: 'SETTINGS_ERROR',
    error,
    message,
  }
}

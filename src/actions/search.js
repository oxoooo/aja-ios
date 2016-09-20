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

export function search(keyword: string): ThunkAction {
  return (dispatch) => {
    client
      .search(keyword)
      // .then(interaction)
      .then(result => {
        dispatch({type: 'SEARCH_RESULT', result})
      })
      .catch(e => {
        console.warn('search result', e);
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

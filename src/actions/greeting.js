// @flow

import type {
  ThunkAction
} from './types';

import client from '../lib/client';

import * as logout from './logout'

function ensureLoggedIn(status: ?number, dispatch: (action: ThunkAction) => void) {
  if (status === 401) {
    dispatch(logout.clear());
  }
}

export function getGreetings(): ThunkAction {
  return (dispatch) => {
    client.greetings()
      .then(greetings => dispatch({ type: 'GREETINGS', greetings }))
      .catch(e => {
        console.warn('greetings', e);
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

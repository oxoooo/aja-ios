// @flow

import { isEmpty } from 'lodash';

import type { ThunkAction } from './types';
import type { Card } from './session';

import * as conversation from './conversation';

import client from '../lib/client';

import * as logout from './logout'

function ensureLoggedIn(status: ?number, dispatch: (action: ThunkAction) => void) {
  if (status === 401) {
    dispatch(logout.clear());
  }
}

export type Notification = {
  uuid: string,
  meta: {
    cards: Array<Card>,
  },
};

export function getNotifications(deviceToken: string): ThunkAction {
  return async function (dispatch) {
    try {
      const notifications: Array<Notification> = await client.notifications(deviceToken);
      notifications.forEach(notification => {
        if (notification.meta && notification.meta.cards) {
          dispatch(conversation.cards(null, notification.meta.cards));
        }
      });
    } catch (e) {
      console.warn('notifications', e);
      ensureLoggedIn(e.status, dispatch);
    }
  };
}

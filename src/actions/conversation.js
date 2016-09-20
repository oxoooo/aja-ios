// @flow

import type { Action, ThunkAction, Dispatch } from './types';
import type { App } from './app';
import type { Card } from './session';

export type Conversation = {
  from: ?App,
  in: ?string,
  out: ?string,
  cards: ?Array<Card>,
  error: ?Error,
  finish: boolean,
};

const initialObject: Conversation = {
  from: null,
  in: null,
  out: null,
  cards: null,
  error: null,
  finish: false,
};

export function income(from: ?App, text: string): Action {
  return {
    type: 'CONVERSATIONS_PUSH',
    conversation: {
      ...initialObject,
      from,
      in: text,
    },
  };
}

export function outgo(from: ?App, text: string): Action {
  return {
    type: 'CONVERSATIONS_PUSH',
    conversation: {
      ...initialObject,
      from,
      out: text,
    },
  };
}

export function cards(from: ?App, cards: Array<Card>): Action {
  return {
    type: 'CONVERSATIONS_PUSH',
    conversation: {
      ...initialObject,
      from,
      cards,
    },
  };
}

export function error(from: ?App, error: Error): Action {
  return {
    type: 'CONVERSATIONS_PUSH',
    conversation: {
      ...initialObject,
      from,
      error,
    },
  };
}

export function finish(from: ?App): Action {
  return {
    type: 'CONVERSATIONS_PUSH',
    conversation: {
      ...initialObject,
      from,
      finish: true,
    },
  };
}

export function clear(): Action {
  return {
    type: 'CONVERSATIONS_CLEAR',
  };
}

// @flow

import type { Action } from './types';

export type App = {
  id: string,
  name: string,
  icon: {
    url: string,
    color: string,
  },
};

export type Entry = {
  id: string,
  name: string,
  description: string,
  icon: {
    url: string,
    color: string,
  },
};

export function create(): Action {
  return {
    type: 'APP_CREATE',
  }
}

export function update(app: ?App, entry: ?Entry): Action {
  return {
    type: 'APP_UPDATE',
    app, entry,
  };
}

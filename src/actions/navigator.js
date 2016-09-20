// @flow
import type {
  Action,
  ThunkAction
} from './types';

export function push(id: string): Action {
  return {
    type: 'NAVIGATOR_PUSH',
    id
  };
}

export function pop(): Action {
  return { type: 'NAVIGATOR_POP' };
}
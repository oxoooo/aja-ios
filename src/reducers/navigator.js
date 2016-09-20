// @flow

import type {
  Action
} from '../actions/types';

type NavAction = 'pop' | 'push' | null

export type State = {
  action: NavAction,
  id: ?string,
  counter: number,
};

const initialState: State = {
  action: null,
  id: null,
  counter: 0,
};

export default function navigator(state: State = initialState, action: Action): State {
  if (action.type === 'NAVIGATOR_PUSH') {
    return {
      ...state,
      action: 'push',
      id: action.id,
      counter: state.counter + 1
    };
  }
  if (action.type === 'NAVIGATOR_POP') {
    return {
      ...state,
      action: 'pop',
      id: null,
      counter: 0,
    }
  }
  return state;
}

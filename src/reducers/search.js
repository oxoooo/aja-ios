// @flow

import type {
  Action
} from '../actions/types';

export type State = {
  result: any
};

const initialState: State = {
  result: {
    q: '',
    entries: [],
  }
};

export default function search(state: State = initialState, action: Action): State {
  if (action.type === 'SEARCH_RESULT') {
    return {
      ...state,
      result: action.result,
    };
  }
  return state;
}

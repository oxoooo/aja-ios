// @flow

import type {
  Action
} from '../actions/types';

export type State = {
  settings: any,
  isLoading: boolean,
  error: {
    message: ?string,
    type: 'error' | 'info' | null,
  }
};

const initialState: State = {
  settings: [],
  isLoading: false,
  error: {
    message: null,
    type: null,
  }
};

export default function settings(state: State = initialState, action: Action): State {
  if (action.type === 'SETTINGS_INDEX') {
    return {
      ...state,
      settings: action.settings,
      isLoading: false,
    };
  }
  if (action.type === 'SET_IS_LOADING') {
    return {
      ...state,
      isLoading: action.isLoading
    }
  }
  if (action.type === 'SETTINGS_ERROR') {
    return {
      ...state,
      error: {
        message: action.message,
        type: 'error',
      }
    }
  }
  if (action.type === 'SETTINGS_CLEAN_ERROR') {
    return {
      ...state,
      error: {
        message: null,
        type: null,
      }
    }
  }
  return state;
}

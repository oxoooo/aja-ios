// @flow

import type { Action } from '../actions/types';
import type { Session, Question } from '../actions/session';

export type State = {
  session: ?Session,
  question: ?Question,
  pending: boolean,
};

const initialState: State = {
  session: null,
  question: null,
  pending: false,
};

export default function session(state: State = initialState, action: Action): State {
  if (action.type === 'SESSION_PENDING') {
    return {
      ...state,
      pending: action.pending,
    }
  }
  if (action.type === 'SESSION_UPDATE') {
    return {
      ...state,
      session: action.session,
    };
  }
  if (action.type === 'SESSION_CLEAR') {
    return {
      ...state,
      session: null,
    }
  }
  if (action.type === 'QUESTION') {
    return {
      ...state,
      question: action.question,
    }
  }
  return state;
}

// @flow

import type { Action } from '../actions/types';
import type { Conversation } from '../actions/conversation';

type State = {
  conversations: Array<Conversation>,
};

const initialState: State = {
  conversations: [],
};

export default function conversation(state: State = initialState, action: Action): State {
  if (action.type === 'CONVERSATIONS_PUSH') {
    return {
      ...state,
      conversations: [
        ...state.conversations,
        action.conversation,
      ]
    }
  }
  if (action.type === 'CONVERSATIONS_CLEAR') {
    return {
      ...state,
      conversations: [],
    }
  }
  return state;
}

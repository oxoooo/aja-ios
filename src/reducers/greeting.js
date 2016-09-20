// @flow

import type {
  Action
} from '../actions/types';

export type State = {
  greetings: Array<string>,
};

const initialState: State = {
  greetings: [ '打开微信扫一扫', '打开支付宝', '今天天气怎么样' ],
};

export default function greeting(state: State = initialState, action: Action): State {
  if (action.type === 'GREETINGS') {
    return {
      ...state,
      greetings: action.greetings,
    };
  }

  return state;
}

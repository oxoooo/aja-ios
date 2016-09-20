// @flow

import type { App, Entry } from './app'
import type { Session, Question } from './session';
import type { Conversation } from './conversation';

export type Action =
    { type: 'LOGIN_STATE', state: number, error: ?Error }
  | { type: 'LOGOUT' }

  | { type: 'SEARCH_RESULT', result: any }

  // 个人设置
  | { type: 'SETTINGS_INDEX', settings: any }
  | { type: 'SETTINGS_ERROR', error: ?Error, message: ?string }

  | { type: 'APP_CREATE' }
  | { type: 'APP_UPDATE', app: ?App, entry: ?Entry }

  // Session 相关
  // 正在等待 Session 更新
  | { type: 'SESSION_PENDING', pending: boolean }
  // Session 更新
  | { type: 'SESSION_UPDATE', session: Session }
  // Session 结束
  | { type: 'SESSION_CLEAR' }

  // 问题更新
  | { type: 'QUESTION', question: ?Question }

  | { type: 'CONVERSATIONS_PUSH', conversation: Conversation }
  | { type: 'CONVERSATIONS_CLEAR' }

  | { type: 'SET_IS_LOADING', isLoading: boolean }
  | { type: 'NAVIGATOR_PUSH', id: string }
  | { type: 'NAVIGATOR_POP' }
  | { type: 'NAVIGATOR_RESET'}

  | { type: 'GREETINGS', greetings: Array<string> }
  ;

export type PromiseAction = Promise<Action>;
export type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
export type GetState = () => Object;
export type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;

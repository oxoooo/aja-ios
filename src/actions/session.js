// @flow

import { Linking } from 'react-native';

import type { Action, ThunkAction, Dispatch } from './types';
import type { App, Entry } from './app';
import type { Conversation } from './conversation';

import client from '../lib/client';
import interaction from '../lib/interaction';
import * as geolocation from '../lib/geolocation';

import * as robot from './app';
import * as conversation from './conversation';
import * as logout from './logout'

function ensureLoggedIn(status: ?number, dispatch: (action: ThunkAction) => void) {
  if (status === 401) {
    dispatch(logout.clear());
  }
}

export type Session = {
  id: string,
  text: string,
  cards: Array<Card>,
  intro: string,
  finish: boolean,
  action: { uri: string },
  question: Question,
};

export type Question = {
  name: string,
  type: string,
  flags: Array<string>,
};

export type Card = {
  text: string,
  html: string,
  width: number,
  height: number,
  href: string,
  authed: boolean,
};

function dispatchSession(dispatch: Dispatch, app: ?App, entry: ?Entry, session: Session): void {
  if (session.app && session.entry) {
    app = session.app;
    entry = session.entry;
    dispatch(robot.update(app, entry));
  }

  if (session.intro) {
    dispatch(conversation.outgo(app, session.intro));
  }

  if (session.cards) {
    dispatch(conversation.cards(app, session.cards));
  } else if (session.text) {
    dispatch(conversation.income(app, session.text));
  }

  if (session.finish) {
    if (session.action) {
      Linking.openURL(session.action.uri);
    }

    dispatch(conversation.finish(app));

    dispatch(clear());
    dispatch(question(null));
    dispatch(robot.update(null, null));
  } else {
    if (session.question &&
        session.question.type == 'place' &&
        session.question.flags.indexOf('auto') != -1) {
      reportLocation(dispatch, app, entry, session);
    } else {
      dispatch(update(session));
      dispatch(question(session.question));
    }
  }
}

function getLocation(timeout: number = 10000, maximumAge: number = 1000) {
  return geolocation.getCurrent({ timeout, maximumAge }).then(({ coords }) => ({
    lat: coords.latitude,
    lng: coords.longitude,
  }));
}

function reportLocation(dispatch: Dispatch, app: ?App, entry: ?Entry, session: Session): void {
  dispatch(pending(true));
  getLocation(20000, 1000)
    .then(location => ({ location }))
    .then(place => dispatch(reply(app, entry, session, place)));
}

export function create(entry: Entry): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(robot.create());
    interaction()
      .then(() => {
        dispatch(conversation.clear());
        dispatch(pending(true));
        return getLocation(10000, 60000).catch(ignored => {})
      })
      .then(location => client.createSession(entry.id, location))
      .then(extraFlags)
      .then(dispatchSession.bind(null, dispatch, null, null))
      .then(session => {
        dispatch(pending(false));
        return session;
      })
      .catch(e => {
        console.warn('create session', e);
        dispatch(clear());
        dispatch(question(null));
        dispatch(pending(false));
        dispatch(robot.update(null, null));
        dispatch(conversation.error(entry, e));
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

export function createFromText(text: string): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(robot.create());
    interaction()
      .then(() => {
        dispatch(conversation.clear());
        dispatch(conversation.outgo(null, text));
        dispatch(pending(true));
        return getLocation(10000, 60000).catch(ignored => {})
      })
      .then(location => client.createSessionFromText(text, location))
      .then(extraFlags)
      .then(dispatchSession.bind(null, dispatch, null, null))
      .then(session => {
        dispatch(pending(false));
        return session;
      })
      .catch(e => {
        console.warn('create session from text', e);
        dispatch(clear());
        dispatch(question(null));
        dispatch(pending(false));
        dispatch(robot.update(null, null));
        dispatch(conversation.error(null, e));
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

export function reply(app: ?App, entry: ?Entry, session: Session, value: any): ThunkAction {
  return (dispatch: Dispatch) => {
    interaction()
      .then(() => {
        dispatch(question(null));
        dispatch(pending(true));
      })
      .then(() => client.replySession(session.id, session.question.name, value))
      .then(extraFlags)
      .then(dispatchSession.bind(null, dispatch, app, entry))
      .then(session => {
        dispatch(pending(false));
        return session;
      })
      .catch(e => {
        console.warn('reply session', e);
        dispatch(clear());
        dispatch(question(null));
        dispatch(pending(false));
        dispatch(robot.update(null, null));
        dispatch(conversation.error(app, e));
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

export function terminate(app: ?App, entry: ?Entry, session: Session): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(clear());
    dispatch(question(null));
    dispatch(pending(false));
    dispatch(robot.update(null, null));
    dispatch(conversation.finish(app));
    client.delSession(session.id)
      .catch(e => {
        console.warn('terminate session', e);
        ensureLoggedIn(e.status, dispatch);
      });
  }
}

export function pending(pending: boolean): Action {
  return {
    type: 'SESSION_PENDING',
    pending,
  };
}

export function update(session: Session): Action {
  return {
    type: 'SESSION_UPDATE',
    session,
  };
}

export function clear(): Action {
  return {
    type: 'SESSION_CLEAR',
  };
}

export function question(question: ?Question): Action {
  return {
    type: 'QUESTION',
    question,
  };
}

function extraFlags(session: Session): Session {
  session = { ...session };

  if (session.question && session.question.type) {
    const flags: Array<string> = session.question.type.split(':');
    if (flags.length > 1) {
      session.question = {
        ...session.question,
        type: flags[0],
        flags: flags.slice(1),
      };
    } else {
      session.question = {
        ...session.question,
        flags: [],
      };
    }
  }

  return session;
}

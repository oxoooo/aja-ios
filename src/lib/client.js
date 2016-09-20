// @flow weak
import * as qs from 'querystring';
import { API, request, apiPath } from './http';
import { getUserToken } from './token';

import type { Notification } from '../actions/notification';

export type Token = any;

let __token: Token = null;

class Client {

  /* $FlowFixMe - get/set properties not yet supported */
  get token(): Token {
    return __token;
  }

  /* $FlowFixMe - get/set properties not yet supported */
  set token(token) {
    if (token !== __token) {
      if (__DEV__) {
        console.log('%cchange user token: %o', 'color: #AD1457; font-weight: bold', token);
      }
      __token = token;
    }
  }

  init(callback: () => void) {
    getUserToken()
    .then((token) => {
      if (__DEV__) {
        console.log('%cuser_token: %o', 'color: #AD1457; font-weight: bold', token);
      }
      __token = token;
      callback();
    })
    .catch((err) => {
      callback();
    })
  }

  @request('POST')
  sendPhone(phone: string) {
    return {
      url: apiPath('user'),
      body: { phone }
    }
  }

  @request('POST')
  login(username: string, password: string) {
    return {
      url: `${API}/oauth/token`,
      body: {username, password, grant_type: 'password'}
    }
  }

  @request('GET')
  userInfo() {
    return { url: apiPath('user') }
  }

  @request("POST")
  logout() {
    return {
      url: `${API}/oauth/revoke`,
      body: {refresh_token: this.token.refresh_token}
    }
  }

  @request('POST')
  createSession(entry_id: string, location: ?any) {
    return {
      url: apiPath('sessions'),
      body: { entry_id, location }
    }
  }

  @request('POST')
  createSessionFromText(text: string, location: ?any) {
    return {
      url: apiPath('sessions'),
      body: { text, location }
    }
  }

  @request('PUT')
  replySession(session_id: string, key: string, value: string) {
    return {
      url: apiPath(`sessions/${session_id}`),
      body: {key, value}
    }
  }

  @request('DELETE')
  delSession(session_id: string) {
    return {
      url: apiPath(`sessions/${session_id}`),
    }
  }

  @request('GET')
  indexSetting() {
    return {
      url: apiPath('apps'),
    }
  }

  @request('GET')
  showSetting(app_id: string) {
    return {
      url: apiPath(`apps/${app_id}`)
    }
  }

  @request('DELETE')
  delSetting(app_id: string) {
    return { url: apiPath(`apps/${app_id}`) }
  }

  @request('GET')
  greetings() {
    return {
      url: apiPath('greetings')
    }
  }

  @request('POST')
  retrieveUserToken(app_id: string) {
    return {
      url: apiPath(`apps/${app_id}/token`)
    }
  }

  @request('PUT')
  submitDeviceToken(deviceToken: string) {
    var body;
    if(__DEV__){
      body = {
        name: 'ios',
        token: deviceToken,
        dev: true,
      }
    } else {
      body = {
        name: 'ios',
        token: deviceToken,
      }
    }
    return {
      url: apiPath('user/device_token'),
      body: body,
    }
  }

  @request('GET')
  search(q: string) {
    return {
      url: `${apiPath('entries')}?${qs.stringify({q})}`
    }
  }

  @request('GET')
  notifications(device_token: string): Array<Notification> {
    return {
      url: `${apiPath('notifications')}?${qs.stringify({ device_token })}`
    }
  }

}

const client = new Client();
export default client;

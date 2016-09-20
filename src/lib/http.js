import { setUserToken } from './token';

import { server } from '../../configs';

if (__DEV__) {
  console.log(`using server ${server}`);
}

export const API = server;

export class HttpStatusError extends Error {
  constructor(response, body = {}) {
    super(`HTTP ${response.status} ${response.url}\n${JSON.stringify(body)}`);

    this.name = 'HttpStatusError';
    this.body = body;
    this.status = response.status;
    this.url = response.url;
    this.response = response;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this);
    }
  }
}

export function apiPath(name) {
  return `${API}/v1/${name}`
}

export function request(method) {
  return (target, name, descriptor) => {
    descriptor.oldValue = descriptor.value;

    descriptor.value = (...args) => {
      let metaValue = descriptor.oldValue.apply(target, args);
      let body = JSON.stringify(metaValue.body);

      let requester = async function requester(token) {
        const headers = makeHeaders(token);

        if (__DEV__) {
          console.log(`${method.toUpperCase()} ${metaValue.url}`);
          Object.keys(headers).forEach((key) => {
            console.log(`  ${key}: ${headers[key]}`);
          });
          if (metaValue.body) {
            console.log(metaValue.body);
          }
        }

        const res = await fetch(metaValue.url, { method, headers, body });

        if (__DEV__) {
          console.log(`${res.status} (${method.toUpperCase()} ${metaValue.url})`);
          Object.keys(res.headers.map).forEach((key) => {
            console.log(`  ${key}: ${res.headers.map[key]}`);
          });
        }

        if (res.status == 204) {
          return null;
        }

        const json = await res.json();

        if (res.status >= 400) {
          throw new HttpStatusError(res, json);
        }

        if (__DEV__) {
          console.log(json);
        }

        return json;
      }

      if (target.token) {
        return Promise
          .resolve(target.token)
          .then(shouldRefreshToken)
          .then((token) => {
            target.token = token;
            return requester(target.token);
          });
      } else {
        return requester();
      }
    }

    return descriptor;
  };
}

function makeHeaders(token) {
  let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (token && token.access_token) {
    headers['Authorization'] = `Bearer ${token.access_token}`;
  }

  return headers;
}

// @deprecated
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return response.json().then(body => {
      throw new HttpStatusError(response, body);
    });
  }
}

// @deprecated
function jsonify(response) {
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

function refreshToken(token) {
  return fetch(`${API}/oauth/token`, {
      method: 'POST',
      headers: makeHeaders(),
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: token.refresh_token
      }),
    })
    .then(checkStatus)
    .then(jsonify);
}

function shouldRefreshToken(token) {
  let now = Math.floor(new Date() / 1000);
  if (now - token.now > token.expires_in - 10) {
    return refreshToken(token).then(setUserToken);
  } else {
    return Promise.resolve(token);
  }
}

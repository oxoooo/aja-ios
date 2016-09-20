import React, {
  Component
} from 'react';

import {
  connect
} from 'react-redux';

import {
  View
} from 'react-native';

import client from './lib/client';

import LoginScene from './login/LoginScene';
import HomeScene from './home/HomeScene';

import { STATE_VERIFIED } from './actions/login';

@connect(mapStateToProps, mapDispatchToProps)
export default class AJAApp extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.loginState == STATE_VERIFIED) {
      return <HomeScene />
    } else {
      return <LoginScene />
    }
  }

}

function mapStateToProps(store) {
  return {
    loginState: store.login.state,
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

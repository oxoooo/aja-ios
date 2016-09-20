import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from '../widgets/Button';
import TextField from '../widgets/TextField';

import { background_white } from '../colors'

import { connect } from 'react-redux';

import * as actions from '../actions/login';
import { STATE_SENDING, STATE_SEND_FAILED } from '../actions/login';

@connect(mapStateToProps, mapDispatchToProps)
export default class PhoneComponent extends Component {

  state: {
    error: string,
  } = {
    error: '',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginError && nextProps.loginState == STATE_SEND_FAILED) {
      this.setState({ error: '请检查您的手机号是否正确' });
    } else {
      this.setState({ error: '' });
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.title}>使用手机号登录</Text>

        <TextField
          style={styles.phone}
          prefixText="+86"
          errorText={this.state.error}
          placeholder='手机号'
          keyboardType='phone-pad'
          maxLength={11}
          onChangeText={this.props.onChangePhone}
        />

        <Button
          style={styles.send}
          disabled={(this.props.loginState == STATE_SENDING || !this.props.phone)}
          onPress={this.props.send}
        >获取安全码</Button>

      </View>
    );
  }

}

function mapStateToProps(store) {
  return {
    loginState: store.login.state,
    loginError: store.login.error,
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: background_white,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 80,
    marginBottom: 56
  },
  phone: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  send: {
    margin: 16,
  },
  sonic: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
});

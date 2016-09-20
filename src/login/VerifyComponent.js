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
import { STATE_VERIFYING, STATE_VERIFY_FAILED } from '../actions/login';

@connect(mapStateToProps, mapDispatchToProps)
export default class VerifyComponent extends Component {

  state: {
    error: string,
  } = {
    error: '',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.loginError && nextProps.loginState == STATE_VERIFY_FAILED) {
      this.setState({ error: '安全码错误' });
    } else {
      this.setState({ error: '' });
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.title}>安全码已发送至</Text>
        <Text style={styles.phone}>+86 {this.props.phone}</Text>

        <TextField
          style={styles.code}
          prefixText="安全码"
          errorText={this.state.error}
          autoFocus
          placeholder='请输入安全码'
          keyboardType='number-pad'
          maxLength={6}
          onChangeText={this.props.onChangeCode}
        />

        <Button
          style={styles.login}
          disabled={(this.props.loginState == STATE_VERIFYING || !this.props.code)}
          onPress={this.props.login}
        >确定</Button>

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
  return {}
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
  },
  phone: {
    fontSize: 20,
    textAlign: 'center',
    color: '#949494',
    marginTop: 4,
    marginBottom: 22,
    height: 30,
  },
  code: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  login: {
    margin: 16,
  },
});

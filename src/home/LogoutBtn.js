// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';

import { button_primary } from '../colors';

import * as actions from '../actions/logout';

@connect(mapStateToProps, mapDispatchToProps)
export default class LogoutBtn extends Component {
  render() {
    return (
      <TouchableOpacity
        style={styles.nav_button}
        onPress={this.logoutAlert.bind(this)}>
        <Text style={styles.nav_text}>退出</Text>
      </TouchableOpacity>
    );
  }

  logoutAlert() {
    Alert.alert(
      '提示',
      '你确定要退出吗？',
      [
        {text: '确定', onPress: this.logout.bind(this)},
        {text: '取消', onPress: () => console.log('cancel'), style: 'default'},
      ]
    );
  }

  logout() {
    this.props.logout();
  }

}

function mapStateToProps(store) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(actions.logout()),
  }
}

const styles = StyleSheet.create({
  nav_button: {
    paddingRight: 10,
  },
  nav_text: {
    color: button_primary,
    fontSize: 16,
    marginTop: 10
  },
});

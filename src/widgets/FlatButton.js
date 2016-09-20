// @flow

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { button_disabled, button_primary, button_secondary } from '../colors';

export default class FlatButton extends Component {

  render() {
    const {
      style,
      textStyle,
      primary,
      disabled,
      children,
      ...others,
    } = this.props

    return (
      <TouchableOpacity
        {...others}
        style={[ style, styles.button ]}
      >

        <Text style={[
          textStyle,
          styles.text,
          { color: (disabled ? button_disabled : (primary ? button_primary : button_secondary)) },
        ]}>{children}</Text>

      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  button: {
    minWidth: 88,
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
});

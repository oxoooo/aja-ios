// @flow

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { button_disabled, button_primary } from '../colors';

export default class Button extends Component {

  render() {
    const {
      style,
      textStyle,
      disabled,
      children,
      ...others,
    } = this.props

    return (
      <TouchableOpacity
        {...others}
        style={[
          style,
          styles.button,
          { backgroundColor: (disabled ? button_disabled : button_primary) },
        ]}
      >

        <Text style={[ textStyle, styles.text ]}>{children}</Text>

      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  button: {
    height: 44,
    borderRadius: 2,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

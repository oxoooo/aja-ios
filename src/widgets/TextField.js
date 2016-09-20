// @flow

import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { textField_normal, textField_error } from '../colors';

export default class TextField extends Component {

  render() {
    const {
      style,
      prefixText,
      prefixWidth,
      prefixStyle,
      errorText,
      ...others,
    } = this.props

    return (
      <View style={style}>

        <View
          style={[
            styles.field,
            { borderBottomColor: (errorText ? textField_error : textField_normal) }
          ]}
        >

          <View style={[ styles.prefix, { width: prefixWidth || 64 } ]}>
            <Text style={[ styles.prefixText, prefixStyle ]}>{prefixText}</Text>
          </View>

          <TextInput style={styles.input} {...others} />

        </View>

        <Text style={styles.error}>{errorText}</Text>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  field: {
    height: 44,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  prefix: {
    height: 44,
    justifyContent: 'center',
  },
  prefixText: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    height: 14,
    textAlign: 'right',
    marginTop: 8,
    color: textField_error,
  },
});

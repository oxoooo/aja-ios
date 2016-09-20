// @flow

import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { button_primary } from '../../colors'

export type Props = {
  placeholder: ?string,
  onSubmit: (number: string) => void,
};

export default class NumberInputView extends Component {

  input: ?string = null;

  replyText() {
    const text = this.input;
    if (text) {
      this.input = null;
      this.props.onSubmit(text);
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <TextInput
            style={styles.field}
            placeholder={this.props.placeholder}
            keyboardType={this.props.type || 'numeric'}
            autoFocus
            onChangeText={text => this.input = text} />

        <TouchableOpacity
            style={styles.send}
            onPress={this.replyText.bind(this)}>
            <Text style={{ color: 'white' }}>发送</Text>
        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  field: {
    flex: 1,
    fontSize: 18,
    height: 46,
    lineHeight: 46,
    paddingHorizontal: 10,
    marginTop: 2,
  },
  send: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: button_primary,
  },
});

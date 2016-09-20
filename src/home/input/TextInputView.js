// @flow

import React, { Component } from 'react';

import {
  TextInput,
  StyleSheet,
} from 'react-native';

export type Props = {
  placeholder: ?string,
  onSubmit: (text: string) => void,
};

export default class TextInputView extends Component {

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
      <TextInput
        style={styles.field}
        placeholder={this.props.placeholder}
        keyboardType='default'
        autoFocus
        returnKeyType='send'
        enablesReturnKeyAutomatically
        onChangeText={text => this.input = text}
        onSubmitEditing={this.replyText.bind(this)} />
    );
  }

}

const styles = StyleSheet.create({
  field: {
    fontSize: 18,
    height: 46,
    lineHeight: 46,
    paddingHorizontal: 10,
    marginTop: 2,
  },
});

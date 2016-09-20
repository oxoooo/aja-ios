// @flow

import React, { Component } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export type Props = {
  placeholder: ?string,
  choices: Array<string>,
  onSubmit: (text: string) => void,
};

export default class ChoiceInputView extends Component {

  render() {
    return (
      <View>
        {this.props.choices.map(this.renderItem.bind(this))}
      </View>
    );
  }

  renderItem(choice: string): View {
    return (
      <TouchableOpacity
        key={choice}
        onPress={() => this.props.onSubmit(choice)}>
        <View style={styles.item}>
          <Text style={styles.text}>{choice}</Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  item: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#00000010',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  }
});

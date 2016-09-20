import React, { Component } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import SonicView from '../widgets/SonicView';

export default class HomeSpeechView extends Component {

  componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    const {
      level,
      result,
      ...others,
    } = this.props;

    return (
      <TouchableOpacity {...others}>

        <SonicView style={styles.sonic} level={level} />
        <Text style={[ styles.result, { opacity: result ? 1.0 : 0.5 } ]}>{result || '请说话…'}</Text>

      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  result: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    marginHorizontal: 32,
    marginVertical: 88,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 30,
    backgroundColor: 'transparent',
  },
  sonic: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

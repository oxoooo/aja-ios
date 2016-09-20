import React, { Component } from 'react';

import {
  LayoutAnimation,
  StyleSheet,
  View,
} from 'react-native';

import ImageButton from '../widgets/ImageButton';

import KeyboardIcon from '../icons/keyboard.png';
import VoiceIcon from '../icons/voice.png';
import CardsIcon from '../icons/cards.png';

import { button_primary } from '../colors'

export default class HomeActionView extends Component {

  componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    const {
      openSearch,
      openPersonal,
      startVoice,
      style,
      ...others,
    } = this.props;

    return (
      <View {...others} style={[ styles.action, style ]}>

        <ImageButton
          style={styles.button}
          onPress={openSearch}
          source={KeyboardIcon}
        />

        <ImageButton
          style={[ styles.button, styles.main ]}
          onPress={startVoice}
          source={VoiceIcon}
        />

        <ImageButton
          style={styles.button}
          onPress={openPersonal}
          source={CardsIcon}
        />

      </View>
    );
  }

}

const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    width: 56,
    height: 56,
    margin: 16
  },
  main: {
    backgroundColor: button_primary,
    borderRadius: 28
  }
});

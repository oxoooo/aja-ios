import React, {
  Component
} from 'react';

import {
  View,
  WebView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { isEmpty, reverse } from 'lodash';

import FlatButton from './FlatButton';

const CARD_PADDING = 8;

export default class CardView extends Component {

  constructor(props) {
    super(props);

    const dimens = Dimensions.get('window');
    const ratio = this.props.width / this.props.height;

    this.renderWidth = 640;
    this.renderHeight = this.renderWidth / ratio;

    this.displayWidth = dimens.width - CARD_PADDING * 2;
    this.displayHeight = this.displayWidth / ratio;

    this.offsetX = (this.displayWidth - this.renderWidth) / 2;
    this.offsetY = (this.displayHeight - this.renderHeight) / 2;

    this.scale = this.displayWidth / this.renderWidth;
  }

  renderContainerStyle() {
    return {
      width: this.displayWidth,
      height: this.displayHeight,
      marginHorizontal: 8,
    };
  }

  renderWebStyle() {
    return {
      left: this.offsetX,
      top: this.offsetY,
      width: this.renderWidth,
      height: this.renderHeight,
      transform: [{ scale: this.scale }],
    };
  }

  renderMaskStyle() {
    return {
      width: this.displayWidth,
      height: this.displayHeight,
    }
  }

  render() {
    const {
      buttons,
      html,
      onPress,
    } = this.props;

    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        <View style={this.renderContainerStyle()}>

          <WebView
            style={this.renderWebStyle()}
            source={{ html }}
            scrollEnabled={false} />

          <View style={[ styles.buttons, this.renderMaskStyle() ]}>
            {(!buttons || isEmpty(buttons)) ? null : buttons.map(this.renderButton, this)}
          </View>

        </View>
      </TouchableOpacity>
    );
  }

  renderButton(button, i) {
    return (
      <FlatButton
        key={button}
        primary={i == 0}
        onPress={() => this.props.onPressButton(button)}
      >{button}</FlatButton>
    );
  }

}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
});

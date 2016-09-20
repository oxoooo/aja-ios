// @flow
import React, { Component } from 'react';
import {
  Animated,
  Text,
  Dimensions,
  StyleSheet,
  Easing,
  InteractionManager
} from 'react-native';

export type MessageProps = {
  message: ?string,
  type: 'error' | 'info' | null,
  onClose: () => void,
}

export default class MessageView extends Component {

  props: MessageProps;
  state: {
    bottom: Animated,
  };

  constructor(props: MessageProps) {
    super(props);
    this.state = {
      bottom: new Animated.Value(-60),
    }
  }

  componentWillReceiveProps(nextProps: MessageProps) {
    this.shoudStartAnimated(nextProps);
  }

  shoudStartAnimated(props: MessageProps) {
    if (props.message && props.type) {
      this.startAnimated()
    }
  }

  startAnimated() {
    InteractionManager.runAfterInteractions(() => {
      this._startAnimated();
    });
  }

  _startAnimated() {
    const timing = Animated.timing;
    Animated.sequence([
      timing(this.state.bottom, {
        toValue: 0,
        duration: 200,
        easing: Easing.easeOut,
      }),
      Animated.delay(2000),
      timing(this.state.bottom, {
        toValue: -60,
        duration: 200,
        easing: Easing.easeIn,
      })
    ]).start(this.props.onClose);
  }

  render() {
    return (
      <Animated.View style={[styles.container, this.renderCss(),
        {bottom: this.state.bottom}]}>
        <Text style={styles.info}>{this.props.message}</Text>
      </Animated.View>
    );
  }
  renderCss() {
    if (this.props.type === 'error') {
      return {backgroundColor: '#D0021B'};
    } else {
      var color = 'green';
      return {backgroundColor: '#13CAA6'};
    }
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  info: {
    color: '#fff',
    fontSize: 16,
  }
});
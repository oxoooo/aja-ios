import React, {
  Component
} from 'react';

import {
  Animated,
} from 'react-native';

import Keyboard from 'Keyboard';

export default class KeyboardSpace extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      height: new Animated.Value(0)
    };

    this.keyboardWillShowSubscription = null;
    this.keyboardWillHideSubscription = null;
  }

  componentDidMount() {
    this.keyboardWillShowSubscription = Keyboard.addListener(
      'keyboardWillShow', this.keyboardWillShow.bind(this));

    this.keyboardWillHideSubscription = Keyboard.addListener(
      'keyboardWillHide', this.keyboardWillHide.bind(this));
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  keyboardWillShow(e) {
    if (typeof this.props.onKeyboardWillShow === 'function') {
      this.props.onKeyboardWillShow(e);
    }

    Animated.timing(this.state.height, {
      toValue: e.endCoordinates ? e.endCoordinates.height : e.end.height,
      duration: e.duration
    }).start(() => {
      if (typeof this.props.onKeyboardDidShow === 'function') {
        this.props.onKeyboardDidShow(e);
      }
    });
  }

  keyboardWillHide(e) {
    if (typeof this.props.onKeyboardWillHide === 'function') {
      this.props.onKeyboardWillHide(e);
    }

    Animated.timing(this.state.height, {
      toValue: 0,
      duration: e.duration
    }).start(() => {
      if (typeof this.props.onKeyboardDidHide === 'function') {
        this.props.onKeyboardDidHide(e);
      }
    });
  }

  render() {
    return (
      <Animated.View style={{height: this.state.height}} />
    );
  }

}

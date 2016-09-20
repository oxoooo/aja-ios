import React, { Component } from 'react';

import {
  Animated,
  Easing,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { isEmpty } from 'lodash';

import NormalBrand from '../images/brand-normal.png';

import { connect } from 'react-redux';

import * as actions from '../actions/greeting';

@connect(mapStateToProps, mapDispatchToProps)
export default class HomeBrandingView extends Component {

  state = {
    offset: new Animated.Value(10),
    opacity: new Animated.Value(0),
    index: 0,
    text: '',
  };

  componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  componentDidMount() {
    this.runAnimation = true;
    this.startAnimation();
    this.props.getGreetings();
  }

  componentWillUnmount() {
    LayoutAnimation.easeInEaseOut();
    this.runAnimation = false;
  }

  startAnimation() {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.offset, {
          toValue: 0,
          easing: Easing.qual,
          duration: 1000,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 1,
          easing: Easing.qual,
          duration: 1000,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(this.state.offset, {
          toValue: 10,
          easing: Easing.qual,
          duration: 1000,
        }),
        Animated.timing(this.state.opacity, {
          toValue: 0,
          easing: Easing.qual,
          duration: 1000,
        }),
      ]),
    ]).start(() => {
      if (this.runAnimation) {
        this.changeText();
        this.startAnimation();
      }
    });
  }

  changeText() {
    const {
      greetings,
    } = this.props;

    if (isEmpty(greetings)) {
      return;
    }

    let nextIndex = this.state.index + 1;
    if (nextIndex >= greetings.length) {
      nextIndex = 0;
    }

    this.setState({
      index: nextIndex,
      text: greetings[nextIndex],
    });
  }

  render() {
    const {
      style,
      ...others,
    } = this.props;

    const {
      text,
      offset,
      opacity,
    } = this.state;

    return (
      <View {...others} style={[ style, styles.container ]}>

        <Animated.Image
          source={NormalBrand}
          style={{ marginBottom: offset }}
        />

        <Animated.Text style={[ styles.text, { opacity } ]}>{text}</Animated.Text>

      </View>
    );
  }

}

function mapStateToProps(store) {
  return {
    greetings: store.greeting.greetings,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGreetings: () => dispatch(actions.getGreetings()),
  }
}

const styles = StyleSheet.create({
  container: {
    height: 130,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  text: {
    marginTop: 20,
  },
});

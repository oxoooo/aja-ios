//@flow
'use strict'

import React, { Component } from 'react';
import { ART, Dimensions, Animated, Easing } from 'react-native';
const { Shape, Surface, Group } = ART;

class SonicShape extends Component {

  getPath(): string {
    const wave = this.props.wave || 1;
    const level = this.props.peak || 0;

    const middle = this.props.height / 2;
    const split = this.props.width / wave;

    let path: string = `M 0 ${this.props.height / 2} `;

    for (let i = 0; i < wave; i++) {
      const l = split * 0.25 * level * (i % 2 ? 1 : -1);
      const c = `${split * (i + 0.5)} ${(middle + l)}`
      path += `C ${c}, ${c}, ${split * (i + 1.0)} ${middle}`;
    }

    path += `L ${this.props.width} ${this.props.height} L 0 ${this.props.height} Z`;

    return path;
  }

  render () {
    return (
      <Shape fill={this.props.color || '#000000'} d={this.getPath()} />
    );
  }

}

const AnimatedSonicShape = Animated.createAnimatedComponent(SonicShape);

class SonicLayer extends Component {

  props: {
    /* 振荡周期 */
    period: number,

    /* 振荡等级 */
    level: number,

    /* 波数 */
    wave: number,

    /* 宽高 */
    width: number,
    height: number,

    /* 颜色 */
    color: string,
  };

  state: {
    peak: Animated.AnimatedValue,
  };

  runAnimation: boolean;

  state = {
    peak: new Animated.Value(0),
  };

  getPeriod(): number {
    return (this.props.period || 300) + Math.random() * 500;
  }

  startAnimation() {
    Animated.sequence([
      Animated.timing(this.state.peak, {
        toValue: Math.max(0.1, this.props.level),
        easing: Easing.qual,
        duration: this.getPeriod() / 2
      }),
      Animated.timing(this.state.peak, {
        toValue: -Math.max(0.1, this.props.level),
        easing: Easing.qual,
        duration: this.getPeriod() / 2
      })
    ]).start(() => {
      if (this.runAnimation) {
        this.startAnimation();
      }
    });
  }

  componentDidMount() {
    this.runAnimation = true;
    this.startAnimation();
  }

  componentWillUnmount() {
    this.runAnimation = false;
  }

  render () {
    return (
      <AnimatedSonicShape
        peak={this.state.peak}
        wave={this.props.wave}
        color={this.props.color}
        width={this.props.width}
        height={this.props.height} />
    );
  }

}

export default class SonicView extends Component {

  width: number = Dimensions.get('window').width;

  height: number = this.props.height || 400;

  render() {
    return (
      <Surface style={this.props.style} width={this.width} height={this.height}>
        <Group>

          <SonicLayer
            wave={2}
            color='#50E3C2FF'
            level={this.props.level}
            period={this.props.period}
            width={this.width}
            height={this.height} />

          <SonicLayer
            wave={3}
            color='#46DBBAB2'
            level={this.props.level}
            period={this.props.period}
            width={this.width}
            height={this.height} />

          <SonicLayer
            wave={5}
            color='#47CCC2CC'
            level={this.props.level}
            period={this.props.period}
            width={this.width}
            height={this.height} />

        </Group>
      </Surface>
    );
  }

}

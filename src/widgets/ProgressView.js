// @flow

import React, { Component } from 'react';
import { ART, Dimensions, Animated, Easing } from 'react-native';
const { Shape, Surface, Group } = ART;

type ProgressShapeProps = {
  width: number,
  height: number,
  color: string,
  weight: number,
  rotate: number,
  gap: number,
};

class ProgressShape extends Component {

  props: ProgressShapeProps;

  getPath(): string {
    const cx: number = this.props.width / 2;
    const cy: number = this.props.height / 2;

    const r: number = Math.min(cx, cy) - this.props.weight / 2;

    const radA = (Math.PI / 180) * (this.props.rotate);
    const radE = (Math.PI / 180) * (this.props.rotate - this.props.gap);

    const xA = cx + Math.sin(radA) * r;
    const yA = cy + Math.cos(radA) * r;

    const xE = cx + Math.sin(radE) * r;
    const yE = cy + Math.cos(radE) * r;

    return `M ${xA} ${yA} A ${r} ${r}, 0, 1, 0, ${xE} ${yE}`;
  }

  render () {
    return (
      <Shape
        stroke={this.props.color}
        strokeWidth={this.props.weight}
        d={this.getPath()} />
    );
  }

}

const AnimatedProgressShape = Animated.createAnimatedComponent(ProgressShape);

export type ProgressViewProps = {
  style: any,
  width: number,
  height: number,
  color: string,
  weight: number,
  gap: number,
  period: number,
};

export default class ProgressView extends Component {

  props: ProgressViewProps;

  state: any = {
    rotate: new Animated.Value(0),
  };

  runAnimation: boolean = false;

  startAnimation() {
    Animated.sequence([
      Animated.timing(this.state.rotate, {
        toValue: -360,
        easing: Easing.linear,
        duration: this.props.period || 700,
      }),
      Animated.timing(this.state.rotate, {
        toValue: 0,
        duration: 0,
      }),
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

  getWidth(): number {
    return this.props.width || 200;
  }

  getHeight(): number {
    return this.props.height || 200;
  }

  render() {
    return (
      <Surface
        style={[ this.props.style, { backgroundColor: 'transparent' } ]}
        width={this.getWidth()}
        height={this.getHeight()}>

        <AnimatedProgressShape
          width={this.getWidth()}
          height={this.getHeight()}
          color={this.props.color || '#000000'}
          weight={this.props.weight || 4}
          gap={this.props.gap || 90}
          rotate={this.state.rotate} />

      </Surface>
    );
  }

}

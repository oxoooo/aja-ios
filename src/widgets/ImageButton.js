// @flow

import React, { Component } from 'react';

import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default class ImageButton extends Component {

  render() {
    const {
      source,
      ...others,
    } = this.props

    return (
      <TouchableOpacity {...others}>

        <Image source={source} />

      </TouchableOpacity>
    );
  }

}

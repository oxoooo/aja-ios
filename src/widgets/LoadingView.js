import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { DoubleBounce } from 'react-native-loader';

export default class LoadingView extends React.Component {
  render() {
    console.log(this.props.hide);
    if (this.props.hide === true) {
      return null;
    }
    return (
      <View style={styles.container}>
        <DoubleBounce size={18} color="#20D8AE" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  }
})

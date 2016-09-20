import React, {
  Component
} from 'react';

import {
  Text,
  View,
  StyleSheet,
  Navigator,
  TouchableOpacity
} from 'react-native';

import {
  connect
} from 'react-redux';

import * as actions from '../actions/login';
import { STATE_VERIFY } from '../actions/login';

import PhoneComponent from './PhoneComponent';
import VerifyComponent from './VerifyComponent';

import SonicView from '../widgets/SonicView';

@connect(mapStateToProps, mapDispatchToProps)
export default class LoginScene extends Component {

  state: {
    phone: string,
    code: string,
  } = {
    phone: '',
    code: '',
  };

  onChangePhone(phone) {
    this.setState({
      phone
    });
  }

  sendCode() {
    this.props.sendCode(this.state.phone);
  }

  onChangeCode(code) {
    this.setState({
      code
    });
  }

  login() {
    this.props.login(this.state.phone, this.state.code);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loginState < STATE_VERIFY && nextProps.loginState >= STATE_VERIFY) {
      this.navigator.push({
        id: 'verify'
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <Navigator
          initialRoute={{ id: 'phone' }}
          renderScene={this.renderScene.bind(this)}
          navigationBar={this.renderNavigationBar()} />

        <SonicView
          style={styles.sonic}
          height={100}
          level={0.5}
          period={1000} />

      </View>
    );
  }

  renderScene(route, navigator) {
    this.navigator = navigator;
    switch (route.id) {
      case 'phone':
        return <PhoneComponent
          phone={this.state.phone}
          onChangePhone={this.onChangePhone.bind(this)}
          send={this.sendCode.bind(this)} />;
      case 'verify':
        return <VerifyComponent
          phone={this.state.phone}
          code={this.state.code}
          onChangeCode={this.onChangeCode.bind(this)}
          login={this.login.bind(this)} />;
    }
  }

  renderNavigationBar() {
    return <Navigator.NavigationBar routeMapper={this} />
  }

  LeftButton(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    return (
      <TouchableOpacity style={styles.nav_button} onPress={() => navigator.pop()}>
        <Text style={styles.nav_text}>返回</Text>
      </TouchableOpacity>
    );
  }

  RightButton(route, navigator, index, navState) {}

  Title(route, navigator, index, navState) {}

}

function mapStateToProps(store) {
  return {
    loginState: store.login.state,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    sendCode: (phone) => dispatch(actions.sendCode(phone)),
    login: (phone, code) => dispatch(actions.login(phone, code)),
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white'
  },
  nav_button: {
    paddingLeft: 10,
  },
  nav_text: {
    color: '#20D8AE',
    fontSize: 16,
    marginVertical: 10
  },
  sonic: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  }
});

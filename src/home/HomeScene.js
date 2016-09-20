//@flow weak
'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Navigator,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import { button_primary } from '../colors';

import * as navigatorActions from '../actions/navigator';
import routes from './routes';

@connect(mapStateToProps, mapDispatchToProps)
export default class HomeScene extends Component {

  state: {
    showNav: boolean,
  };

  props: {
    pop: () => void,
  };

  navigator: Navigator;

  constructor(props) {
    super(props);
    this.state = {
      showNav: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id) {
      this.setState({ showNav: routes[nextProps.id].showNav });
    }
    if (nextProps.action) {
      this.navigator[nextProps.action]({ id: nextProps.id });
    }
  }

  renderScene(route, navigator) {
    this.navigator = navigator;
    let AJComponent = routes[route.id]['component'];
    return <AJComponent route={route} navigator={navigator}/>
  }

  render() {
    return (
      <Navigator
        style={styles.container}
        initialRoute={{ id: 'home' }}
        renderScene={this.renderScene.bind(this)}
        navigationBar={this.renderNavigationBar()} />
    );
  }

  renderNavigationBar(): ?Navigator.NavigationBar {
    if (this.state.showNav) {
      return <Navigator.NavigationBar routeMapper={this} />;
    } else {
      return null;
    }
  }

  RightButton(route, navigator, index, navState): any {
    let RightButton = routes[route.id].rightButton;
    if (RightButton) {
      return <RightButton />;
    } else {
      return null;
    }
  }

  LeftButton(route, navigator, index, navState): any {
    let back = routes[route.id].showBack;
    if (back) {
      return (
        <TouchableOpacity
          style={styles.nav_button}
          onPress={this.props.pop}>
          <Text style={styles.nav_text}>返回</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }

  Title(route, navigator, index, navState): any {
    let title = routes[route.id].title;
    if (title) {
      return <Text style={styles.nav_title}>{title}</Text>;
    } else {
      return null;
    }
  }

}

function mapStateToProps(store) {
  return {
    action: store.navigator.action,
    id: store.navigator.id,
    counter: store.navigator.counter,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    pop: () => dispatch(navigatorActions.pop()),
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  nav_button: {
    paddingLeft: 10,
  },
  nav_text: {
    color: button_primary,
    fontSize: 16,
    marginTop: 10
  },
  nav_title: {
    color: '#000000',
    fontSize: 18,
    marginTop: 9,
  }
});

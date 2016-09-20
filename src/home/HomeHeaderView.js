import React, {
    Component
} from 'react';

import {
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { connect } from 'react-redux';

import * as actions from '../actions/session';

const HEADER_HEIGHT = 64;

@connect(mapStateToProps, mapDispatchToProps)
export default class HomeHeaderView extends Component {

  componentWillMount() {
    LayoutAnimation.easeInEaseOut();
  }

  componentWillUnmount() {
    LayoutAnimation.easeInEaseOut();
  }

  render() {
    const {
      style,
      app,
      entry,
      session,
      terminateSession,
      ...others,
    } = this.props;

    return (
      <View {...others} style={[ style, styles.header ]}>

        <TouchableOpacity
          style={styles.finish}
          onPress={() => terminateSession(app, entry, session)}>

          <Image
            style={styles.finish_icon}
            source={require('../images/icon-close.png')}/>

        </TouchableOpacity>

        <Text style={styles.name}>{app.name}</Text>

        {app.icon && app.icon.color && app.icon.url ? (
          <Image
            style={[ styles.app, { backgroundColor: `#${app.icon.color}` } ]}
            source={{ uri: app.icon.url }}
          />
        ) : null}

      </View>
    );
  }

}

function mapStateToProps(store) {
  return {
    app: store.app.app,
    entry: store.app.entry,
    session: store.session.session,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    terminateSession: (app, entry, session) => dispatch(actions.terminate(app, entry, session)),
  }
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    paddingTop: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center'
  },
  finish: {
    paddingLeft: 10
  },
  finish_icon: {
    width: 24,
    height: 24
  },
  name: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18
  },
  app: {
    marginRight: 10,
    width: 24,
    height: 24,
    borderRadius: 12
  }
});

import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  PushNotificationIOS,
  InteractionManager,
} from 'react-native';


import { connect } from 'react-redux';

import * as sessionActions from '../actions/session';
import * as conversationActions from '../actions/conversation';
import * as navigatorActions from '../actions/navigator';
import * as notificationActions from '../actions/notification';

import client from '../lib/client';
import * as speech from '../lib/speech';

import HomeChatListView from './HomeChatListView';
import HomeHeaderView from './HomeHeaderView';
import HomeActionView from './HomeActionView';
import HomeSpeechView from './HomeSpeechView';
import HomeInputView from './HomeInputView';
import HomeBrandingView from './HomeBrandingView';

import ProgressView from '../widgets/ProgressView';

const STATE_IDLE          = 0;
const STATE_LISTENING     = 1;
const STATE_SPEAKING      = 2;

@connect(mapStateToProps, mapDispatchToProps)
export default class HomeComponent extends Component {

  onVolumeChanged: speech.Subscription;
  onResults: speech.Subscription;

  state: {
    level: number,
    result: string,
    speechState: STATE_IDLE | STATE_LISTENING | STATE_SPEAKING,
    brandingShown: boolean,
  } = {
    level: 0,
    result: '',
    speechState: STATE_IDLE,
    brandingShown: true,
  };

  deviceToken: string = null;

  constructor(props) {
    super(props);

    speech.init();

    this.onVolumeChanged = speech.onVolumeChanged((level) => {
      this.setState({ level });
    });

    this.onResults = speech.onResults((result: string, finish: boolean) => {
      if (this.state.speechState < STATE_LISTENING) {
        return;
      }

      this.setState({ result });

      if (finish) {
        if (result) {
          this.props.createSessionFromText(result);
        }

        this.setState({
          level: 0,
          speechState: STATE_IDLE,
        });
      } else {
        this.setState({
          speechState: STATE_SPEAKING,
        });
      }
    });

    this.startVoice = this.startVoice.bind(this);
    this.stopVoice = this.stopVoice.bind(this);

    this.openSearch = this.openSearch.bind(this);
    this.openPersonal = this.openPersonal.bind(this);

    this.onRegister = this.onRegister.bind(this);
    this.onNotification = this.onNotification.bind(this);
  }

  componentDidMount() {
    PushNotificationIOS.requestPermissions();
    PushNotificationIOS.addEventListener('register', this.onRegister);
    PushNotificationIOS.addEventListener('notification', this.onNotification);
    PushNotificationIOS.setApplicationIconBadgeNumber(0);

    this.willfocus = this.props.navigator.navigationContext.addListener('willfocus', (event) => {
      let routeId = event.data.route.id;
      if (routeId == 'search' || routeId == 'personal' ) {
        this.setState({ brandingShown: false });
      } else if (routeId == 'home') {
        InteractionManager.runAfterInteractions(() => {
          if (!this.props.created) {
            this.setState({ brandingShown: true });
          }
        });
      }
    });
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this.onRegister);
    PushNotificationIOS.removeEventListener('notification', this.onNotification);

    this.onVolumeChanged.remove();
    this.onResults.remove();
    this.willfocus.remove();
  }

  async onRegister(deviceToken) {
    try {
      await client.submitDeviceToken(deviceToken);
      console.log('successfully registered push');
    } catch (e) {
      console.warn('push register failed' ,e);
    }

    this.deviceToken = deviceToken;
    this.props.getNotifications(this.deviceToken);
  }

  onNotification(notification: PushNotificationIOS) {
    this.setState({ brandingShown: false });
    this.props.getNotifications(this.deviceToken);
  }

  startVoice() {
    speech.start();
    this.setState({
      result: '',
      speechState: STATE_LISTENING,
      brandingShown: false,
    });
  }

  stopVoice() {
    speech.stop();
    this.setState({
      speechState: STATE_IDLE,
      brandingShown: !this.props.created,
    });
  }

  openSearch() {
    this.props.openSearch();
  }

  openPersonal() {
    this.props.openPersonal();
  }

  render() {
    const {
      app,
      session,
      pending,
    } = this.props;

    const {
      speechState,
      brandingShown,
    } = this.state;

    return (
      <View style={styles.container}>

        {brandingShown ? (
          <HomeBrandingView style={styles.branding} />
        ) : (
          <HomeChatListView style={styles.chats} />
        )}

        {pending ? (
          <View style={styles.loading}>

            <ProgressView
              width={56}
              height={56}
              color='#20D8AE'
              period={500} />

          </View>
        ) : null}

        <HomeInputView style={styles.inputs} />

        {app && session ? (
          <HomeHeaderView style={styles.header} />
        ) : null}

        {app || pending ? null : (
          <HomeActionView
            style={styles.action}
            startVoice={this.startVoice}
            openSearch={this.openSearch}
            openPersonal={this.openPersonal}
          />
        )}

        {speechState > STATE_IDLE ? (
          <HomeSpeechView
            style={styles.container}
            level={this.state.level}
            result={this.state.result}
            onPress={this.stopVoice}
          />
        ) : null}

      </View>
    );
  }

}

function mapStateToProps(store) {
  return {
    app: store.app.app,
    created: store.app.created,
    session: store.session.session,
    pending: store.session.pending,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    createSessionFromText: (text) => dispatch(sessionActions.createFromText(text)),
    openPersonal: () => dispatch(navigatorActions.push('personal')),
    openSearch: () => dispatch(navigatorActions.push('search')),
    getNotifications: (deviceToken) => dispatch(notificationActions.getNotifications(deviceToken)),
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F4F3F0'
  },
  chats: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  branding: {
    position: 'absolute',
    left: 0,
    top: 200,
    right: 0,
  },
  inputs: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2
  },
  action: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

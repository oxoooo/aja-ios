// @flow weak

import React, { Component } from 'react';

import {
  Alert,
  View,
  Text,
  ListView,
  StyleSheet,
  Keyboard,
  InteractionManager,
  Linking,
} from 'react-native';

import type { App } from '../actions/app';
import type { Card } from '../actions/session';

import { connect } from 'react-redux';
import { format, parse } from 'url';

import * as actions from '../actions/session';

import { createDataSource } from '../lib/utils';

import client from '../lib/client';
import openSafari from '../lib/safari';

import HomeCardBundleView from './HomeCardBundleView';

const TOP_INSET = 80;
const BOTTOM_INSET = 80;

@connect(mapStateToProps, mapDispatchToProps)
export default class HomeChatListView extends Component {

  contentHeight: number = 0;
  viewHeight: number = 0;

  keyboardWillShowSubscription: any;

  state = {
    keyboardHeight: 0,
  };

  componentDidMount() {
    this.keyboardWillShowSubscription = Keyboard.addListener(
      'keyboardWillShow', this.keyboardWillShow.bind(this));
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
  }

  componentDidUpdate(prevProps, prevState) {
    InteractionManager.runAfterInteractions(() => {
      this.scrollToBottom();
    });
  }

  keyboardWillShow(e) {
    const height = e.endCoordinates ? e.endCoordinates.height : e.end.height;
    this.setState({ keyboardHeight: height });
    this.scrollToBottom();
  }

  renderRow(item) {
    if (item.in) {
      return <Text style={[ styles.chat_text, styles.chat_in ]}>{item.in}</Text>;
    } else if (item.out) {
      return <Text style={[ styles.chat_text, styles.chat_out ]}>{item.out}</Text>;
    } else if (item.cards && item.cards.length) {
      return (
        <HomeCardBundleView
          style={styles.chat_cards}
          conversation={item}
          openLink={this.openLink.bind(this, item.from)} />
      );
    } else if (item.error) {
      if (item.error.name === 'HttpStatusError') {
        return <Text style={styles.error}>这个机器人发生了一点小故障，请稍后再试</Text>;
      } else {
        return <Text style={styles.error}>您的网络暂时不可用，请稍后再试</Text>;
      }
    } else if (item.finish) {
      return <Text style={styles.finish}>点击下面按钮，阿加将继续为你服务</Text>;
    } else {
      return null;
    }
  }

  scrollToBottom(animated = true) {
    const scrollHeight = this.contentHeight - this.viewHeight;
    if (scrollHeight > -TOP_INSET) {
      this.refs.conversations
        .getScrollResponder()
        .scrollResponderScrollTo({
          y: scrollHeight + TOP_INSET,
          animated
        });
    }
  }

  renderFooter() {
    const footerHeight: number = this.props.app
      ? this.state.keyboardHeight + 60
      : BOTTOM_INSET;

    if (!footerHeight) {
      return;
    }

    return (
      <View style={{ height: footerHeight }} />
    );
  }

  render() {
    return (
      <ListView
        ref="conversations"
        style={[ this.props.style, { paddingTop: TOP_INSET } ]}
        dataSource={this.props.conversations}
        renderRow={this.renderRow.bind(this)}
        renderFooter={this.renderFooter.bind(this)}
        enableEmptySections={true}
        scrollsToTop={false}
        onContentSizeChange={(w, h) => this.contentHeight = h}
        onLayout={ev => this.viewHeight = ev.nativeEvent.layout.height} />
    );
  }

  openLink(app: App, card: Card) {
    const url: {
      protocol: any,
      query: any,
      search: any,
    } = parse(card.href, true);

    delete url.search;

    if ([ 'http:', 'https:' ].indexOf(url.protocol) == -1) {
      return this.openExternalLink(card.href);
    }

    if (!card.authed) {
      return this.openInternalLink(card.href);
    }

    client.retrieveUserToken(app.id)
      .then(token => {
        url.query.token = token.token;
        const href = format(url);
        this.openInternalLink(href);
      })
      .catch(e => console.warn(e.stack || e));
  }

  openInternalLink(href: string) {
    openSafari(href);
  }

  openExternalLink(href: string) {
    if (href.match(/^tel\:(.+)$/)) {
      Alert.alert('拨打电话', `你要拨打电话 ${RegExp.$1} 吗？`,
        [
          { text: '确定', onPress: () => Linking.openURL(href), style: 'default' },
          { text: '取消' },
        ]
      );
    } else {
      Linking.openURL(href);
    }
  }

}

function mapStateToProps(store) {
  return {
    app: store.app.app,
    conversations: createDataSource(store.conversation.conversations),
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const styles = StyleSheet.create({
  chat_text: {
    fontSize: 18,
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 0,
    lineHeight: 24,
    fontFamily: 'Helvetica',
    fontWeight: '300'
  },
  chat_in: {
    color: '#00000080',
    textAlign: 'left'
  },
  chat_out: {
    color: '#000000FF',
    textAlign: 'right'
  },
  chat_cards: {
    paddingVertical: 8
  },
  error: {
    alignSelf: 'center',
    backgroundColor: '#00000009',
    color: '#00000040',
    fontSize: 12,
    marginHorizontal: 32,
    marginVertical: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  finish: {
    alignSelf: 'center',
    color: '#00000040',
    fontSize: 12,
    marginHorizontal: 32,
    marginVertical: 32,
  },
});

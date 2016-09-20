// @flow

import React, { Component } from 'react';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

import * as sessionActions from '../actions/session';

import type { Conversation } from '../actions/conversation';
import type { Card } from '../actions/session';

import CardView from '../widgets/CardView';

type Props = {
  style: StyleSheet,
  conversation: Conversation,
  openLink: (card: Card) => void,
};

type State = {
  current: number,
};

@connect(mapStateToProps, mapDispatchToProps)
export default class HomeCardBundleView extends Component {

  props: Props;

  state: State = {
    current: 1,
  };

  viewHeight: number;

  render() {
    if (!this.props.conversation) {
      return null;
    }

    if (!this.props.conversation.cards || !this.props.conversation.cards.length) {
      return null;
    }

    const cards: Array<Card> = this.props.conversation.cards;

    return (
      <View style={this.props.style}>

        <View style={styles.header}>
          {this.renderEntry()}
          {this.renderPaging()}
        </View>

        <ScrollView
          ref="scroller"
          horizontal={true}
          pagingEnabled={true}
          scrollEventThrottle={200}
          onScroll={this.afterScroll.bind(this)}
          onLayout={ev => this.viewHeight = ev.nativeEvent.layout.width}>
          {cards.map(this.renderCard.bind(this))}
        </ScrollView>

      </View>
    );
  }

  afterScroll(event: Object) {
    const offset: number = event.nativeEvent.contentOffset.x;
    if (offset > 0) {
      this.setState({ current: Math.round(offset / this.viewHeight) + 1 });
    }
  }

  renderEntry() {
    if (!this.props.conversation.from) {
      return null;
    }

    return <Text style={styles.entry}>{this.props.conversation.from.name}</Text>;
  }

  renderCard(card: Card, i: number) {
    if (i == 0 && this.props.question && this.props.question.type == 'choice') {
      return (
        <CardView
          key={i}
          { ...card}
          onPress={() => this.onPress(card)}
          buttons={this.props.question.choice}
          onPressButton={(button) => this.replyChoice(button)}
        />
      );
    } else {
      return (
        <CardView
          key={i}
          { ...card}
          onPress={() => this.onPress(card)}
        />
      );
    }
  }

  renderPaging() {
    const cards: ?Array<Card> = this.props.conversation.cards;

    if (!cards || cards.length == 1) {
      return null;
    }

    return <Text style={styles.paging}>{`${this.state.current} / ${cards.length}`}</Text>;
  }

  onPress(card: Card) {
    if (card.href) {
      this.props.openLink(card);
    }
  }

  replyChoice(text: string) {
    this.props.replySession(this.props.app, this.props.entry, this.props.session, text);
  }

}

function mapStateToProps(store) {
  return {
    app: store.app.app,
    entry: store.app.entry,
    session: store.session.session,
    question: store.session.question,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    replySession: (app, entry, session, value) => dispatch(sessionActions.reply(app, entry, session, value)),
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  entry: {
    backgroundColor: '#00000009',
    color: '#00000040',
    fontSize: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
  },
  paging: {
    fontSize: 11,
    color: '#00000050',
  },
});

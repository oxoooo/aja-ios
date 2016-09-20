// @flow weak

import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

import { isEmpty } from 'lodash';

import * as sessionActions from '../actions/session';
import * as conversationActions from '../actions/conversation';

import KeyboardSpace from '../widgets/KeyboardSpace';

import TextInputView from './input/TextInputView';
import NumberInputView from './input/NumberInputView';
import ChoiceInputView from './input/ChoiceInputView';

@connect(mapStateToProps, mapDispatchToProps)
export default class HomeInputView extends Component {

  replyText(text: string) {
    this.props.replySession(this.props.app, this.props.entry, this.props.session, text);
    this.props.conversationOut(this.props.app, text);
  }

  render() {
    const {
      question,
      session,
      style,
    } = this.props;

    if (!question) {
      return null;
    }

    // 如果带卡片，单选整合进卡片，不单独显示输入
    if (question.type == 'choice' && session && !isEmpty(session.cards)) {
      return null;
    }

    return (
      <View style={[ style, styles.input ]}>

        {this.renderInput()}

        <KeyboardSpace />

      </View>
    );
  }

  renderInput() {
    const question = this.props.question;
    switch (question.type) {
      case 'text':
        return (
          <TextInputView
            placeholder={question.text}
            onSubmit={this.replyText.bind(this)} />
        );
      case 'number':
        return (
          <NumberInputView
            placeholder={question.text}
            onSubmit={this.replyText.bind(this)} />
        );
      case 'money':
        return (
          <NumberInputView
            placeholder={question.text}
            type="decimal-pad"
            onSubmit={this.replyText.bind(this)} />
        );
      case 'choice':
        return (
          <ChoiceInputView
            placeholder={question.text}
            choices={question.choice}
            onSubmit={this.replyText.bind(this)} />
        );
      case 'place':
        // TODO
        return null;
    }
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
    conversationOut: (app, text) => dispatch(conversationActions.outgo(app, text)),
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#00000020',
  },
});

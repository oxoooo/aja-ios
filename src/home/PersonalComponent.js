// @flow weak

import React, { Component } from 'react';

import { connect } from 'react-redux';

import {
  ListView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import Swipeout from 'react-native-swipeout';

import { createDataSource } from '../lib/utils';
import MessageView from '../widgets/MessageView';

import * as actions from '../actions/settings';

import client from '../lib/client';
import openSafari from '../lib/safari';

@connect(mapStateToProps, mapDispatchToProps)
export default class PersonalComponent extends Component {

  state: {
    scrollEnabled: boolean
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
    }
  }

  componentDidMount() {
    this.props.afterMount();
  }

  /* $FlowFixMe - get/set properties not yet supported */
  get descriptionView() {
    if (this.props.settings.length === 0) {
      return (
        <Text style={styles.descriptionText}>您还没使用过需要进行设置的机器人</Text>
      );
    };
  }

  openSetting(app) {
    client.showSetting(app.id)
      .then(setting => openSafari(setting.url))
      .catch(e => {
        this.props.setError(e, '暂时无法获取设置，请稍后再试');
        console.warn('open setting', e);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        {this.descriptionView}
        <ListView
          scrollEnabled={this.state.scrollEnabled}
          dataSource={this.props.dataSource}
          renderRow={this.renderRow.bind(this)}
          enableEmptySections={true}
          style={styles.settingsContainer} />
        <MessageView message={this.props.error.message}
          type={this.props.error.type} onClose={() => this.props.setError(null, null)}/>
      </View>
    );
  }

  renderRow(row) {
    return (
      <Swipeout
        right={[{text: '删除', onPress: () => this.props.destroy(row.id)}]}
        scroll={scrollEnabled => this.setState({scrollEnabled})}>
          <TouchableOpacity onPress={() => this.openSetting(row)}>
            <View style={styles.row}>
              <Image source={{uri: row.icon.url}} style={styles.icon}/>
              <View>
                <Text style={styles.app_name}>{row.name}</Text>
                <Text style={styles.app_desc}>{row.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
      </Swipeout>
    );
  }

}

function mapStateToProps(store) {
  return {
    settings: store.settings.settings,
    dataSource: createDataSource(store.settings.settings),
    error: store.settings.error,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    afterMount: () => dispatch(actions.index()),
    destroy: (id) => dispatch(actions.destroy(id)),
    setError: (e, message) => dispatch(actions.error(e, message)),
  }
}

const styles = StyleSheet.create({
  descriptionText: {
    marginTop: 70,
    textAlign: 'center',
    fontSize: 18,
    color: '#00000050'
  },
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F4F3F0'
  },
  header: {
    height: 64,
    backgroundColor: '#FFFFFF'
  },
  settingsContainer: {
    flex: 1,
    paddingTop: 1,
  },
  row: {
    backgroundColor: '#FFFFFF',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#00000010',
    borderBottomWidth: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 16,
    marginRight: 16,
  },
  app_name: {
    fontSize: 14,
    color: '#000000FF'
  },
  app_desc: {
    fontSize: 12,
    color: '#00000050',
    marginTop: 2
  }
});

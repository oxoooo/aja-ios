// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  ListView,
  StyleSheet,
} from 'react-native';

import { button_primary } from '../colors';

import HurryBrand from '../images/brand-hurry.png';
import OopsBrand from '../images/brand-oops.png';

import { createDataSource } from '../lib/utils';

import * as searchActions from '../actions/search';
import * as sessionActions from '../actions/session';
import * as navigatorActions from '../actions/navigator';

@connect(mapStateToProps, mapDispatchToProps)
export default class SearchComponent extends Component {

  state = {
    text: '',
  };

  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmitEditing = this.onSubmitEditing.bind(this);
    this.renderRow = this.renderRow.bind(this);
  }

  componentDidMount() {
    this.props.search();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  onChangeText(text) {
    this.props.search(text);
    this.setState({ text });
  }

  onSubmitEditing() {
    const {
      entries,
    } = this.props;

    const {
      text,
    } = this.state;

    if (entries.getRowCount()) {
      this.start(entries.getRowData(0, 0));
    } else {
      this.startFromText(text);
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.search}>

          <TextInput
            style={styles.search_input}
            placeholder='搜索你想要的功能'
            autoCapitalize='none'
            autoCorrect={false}
            clearButtonMode='while-editing'
            returnKeyType='send'
            value={this.state.text}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmitEditing}
          />

          <TouchableOpacity
            style={styles.search_cancel}
            onPress={this.props.backHome}>
            <Text style={styles.search_cancel_text}>取消</Text>
          </TouchableOpacity>

        </View>

        <ListView
          dataSource={this.props.entries}
          renderRow={this.renderRow}
          enableEmptySections={true} />

        {this.renderBrand()}

      </View>
    );
  }

  renderRow(item: any) {
    return (
      <TouchableOpacity
        style={styles.app}
        onPress={() => this.start(item)}>

        <Image
          style={[ styles.app_icon, { backgroundColor: `#${item.icon.color}` } ]}
          source={{ uri: item.icon.url }} />

        <View style={styles.app_details}>

          <Text style={styles.app_name}>{item.name}</Text>
          <Text style={styles.app_desc}>{item.description}</Text>

        </View>

      </TouchableOpacity>
    );
  }

  renderBrand() {
    if (this.props.entries.getRowCount() > 0 || this.state.text.length == 0) {
      return null
    }

    if (this.state.text.match(/^[a-z ]+$/i)) {
      return (
        <View style={styles.brand}>
          <Image source={OopsBrand} key="oops" />
          <Text style={styles.brandText}>噗，找个鸟…</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.brand}>
          <Image source={HurryBrand} key="hurry" />
          <Text style={styles.brandText}>你可以点击「<Text style={styles.brandTextSend}>发送</Text>」直接问阿加</Text>
        </View>
      )
    }
  }

  start(item: any) {
    this.props.backHome();
    this.props.create(item);
  }

  startFromText(text: string) {
    this.props.backHome();
    this.props.createFromText(text);
  }

}

function mapStateToProps(store) {
  return {
    result: store.search.result,
    entries: createDataSource(store.search.result.entries),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    search: (keyword) => dispatch(searchActions.search(keyword)),
    create: (entry) => dispatch(sessionActions.create(entry)),
    createFromText: (text) => dispatch(sessionActions.createFromText(text)),
    backHome: () => dispatch(navigatorActions.pop()),
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
  search: {
    height: 64,
    paddingTop: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#00000010',
    flexDirection: 'row'
  },
  search_input: {
    flex: 1,
    marginLeft: 8,
    paddingHorizontal: 8,
    fontSize: 14
  },
  search_cancel: {
    height: 44,
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  search_cancel_text: {
    paddingHorizontal: 10,
    color: button_primary,
    fontSize: 14,
  },
  app: {
    backgroundColor: 'white',
    borderBottomColor: '#00000010',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  app_icon: {
    width: 46,
    height: 46,
    margin: 16,
    borderRadius: 23
  },
  app_details: {
    flex: 1,
    justifyContent: 'center'
  },
  app_name: {
    fontSize: 16,
    color: '#000000FF'
  },
  app_desc: {
    fontSize: 14,
    color: '#00000050',
    marginTop: 8
  },
  brand: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  brandText: {
    marginTop: 30,
    color: '#B5B5B5',
  },
  brandTextSend: {
    color: '#000000',
  }
});

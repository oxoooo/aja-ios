// @flow
import { ListView } from 'react-native';

export function createDataSource(data: any) {
  let dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1.id !== r2.id
  });
  return dataSource.cloneWithRows(data);
}
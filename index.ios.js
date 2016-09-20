/**
 * @flow
 */
import { AppRegistry } from 'react-native';
import setup from './src/setup';

const App = setup();

AppRegistry.registerComponent('AjAReact', () => App);

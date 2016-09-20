// @flow

import { InteractionManager } from 'react-native';

export default function interaction (data) {
  console.log('waiting interaction to be finished...')
  return InteractionManager.runAfterInteractions()
    .then(() => data);
}

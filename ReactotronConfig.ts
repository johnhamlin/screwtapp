import Reactotron, { networking } from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import { reactotronRedux } from 'reactotron-redux';

import { MmkvStorage } from '@/mmkv';

const reactotron = Reactotron.configure({ name: 'ScrewTapp' })
  .useReactNative()
  // @ts-expect-error Reactotron plugin types don't match with newer TS - works at runtime
  .use(networking())
  // .use(mmkvPlugin({ storage }))
  .use(reactotronRedux())
  .connect();

export default reactotron;

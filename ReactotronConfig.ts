import Reactotron, { networking } from 'reactotron-react-native';
import mmkvPlugin from 'reactotron-react-native-mmkv';
import { reactotronRedux } from 'reactotron-redux';

import { MmkvStorage } from '@/mmkv';

const reactotron = Reactotron.configure({ name: 'ScrewTapp' })
  .useReactNative()
  // @ts-expect-error this works but TS isn't happy. It's what the docs say to do.
  .use(networking())
  // @ts-expect-error this works but TS isn't happy. It's what the docs say to do.
  // .use(mmkvPlugin({ storage }))
  .use(reactotronRedux())
  .connect();

export default reactotron;

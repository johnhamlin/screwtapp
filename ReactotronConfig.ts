import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure({ name: 'ScrewTapp' })
  .useReactNative()
  .use(reactotronRedux())
  .connect(); //Don't forget about me!

export default reactotron; // also: export me so I can be referenced by Redux store

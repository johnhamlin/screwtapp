import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

// then add it to the plugin list
const reactotron = Reactotron.configure({ name: 'React Native Demo' })
  .use(reactotronRedux())
  .useReactNative() // add all built-in react native plugins
  .connect();

export default reactotron; // also: export me so I can be referenced by Redux store

import { Provider } from 'react-redux';
import { store } from '../model/redux/store';
import { Slot } from 'expo-router';
import { NativeBaseProvider } from 'native-base';

export default function Layout() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <Slot />
      </NativeBaseProvider>
    </Provider>
  );
}

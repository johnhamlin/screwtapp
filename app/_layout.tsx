import { Provider } from 'react-redux';
import { store } from '../model/redux/store';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <Provider store={store}>
      <Slot />
    </Provider>
  );
}

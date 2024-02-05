import { StyleSheet } from 'react-native';

export const listStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  albumThumbnail: {
    width: 56,
    height: 56,
  },
  item: {
    paddingLeft: 20,
  },
  title: {
    paddingRight: 18,
  },
  // Can't use this styling for FlashList container because it breaks the layout
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import { StyleSheet } from 'react-native';

export const listStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  albumThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  item: {
    paddingLeft: 20,
  },
  title: {
    paddingRight: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

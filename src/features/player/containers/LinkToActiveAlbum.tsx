import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';

import { selectActiveTrackId } from '../slice';

type LinkToActiveAlbumProps = React.ComponentProps<typeof Pressable> & {
  isInModal?: boolean;
  children: React.ReactNode;
};

export default function LinkToActiveAlbum({
  isInModal = false,
  children,
  ...props
}: LinkToActiveAlbumProps) {
  // const {isModal = false, children} = props;
  //   isInModal = false,
  //   children,
  const id = useSelector(selectActiveTrackId);

  return (
    // Tap on the artwork to navigate to the mixtape
    <Pressable
      {...props}
      onPress={() => {
        // If in a modal, close it with back
        isInModal && router.back();
        // navigate to the mixtape
        router.navigate({
          pathname: 'mixtape/[id]',
          params: { id },
        });
      }}
    >
      {children}
    </Pressable>
  );
}

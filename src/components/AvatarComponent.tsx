import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

// Sample avatar data (you can replace these with actual avatar images)
const avatars = [
  { id: '1', src: require('./assets/Avatars/A1.png') },
  { id: '2', src: require('./assets/Avatars/A2.png') },
  { id: '3', src: require('./assets/Avatars/A3.png') },
  { id: '4', src: require('./assets/Avatars/A4.png') },
  { id: '5', src: require('./assets/Avatars/A5.png') },
  { id: '6', src: require('./assets/Avatars/A6.png') },
  { id: '7', src: require('./assets/Avatars/A7.png') },
  { id: '8', src: require('./assets/Avatars/A8.png') },
  { id: '9', src: require('./assets/Avatars/A9.png') },
  // Add more avatars here
];

const AvatarComponent = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);

  const handleSwipe = (index: number) => {
    setSelectedAvatar(index);
  };

  const renderItem = ({ item, index }: { item: { src: any }, index: number }) => {
    return (
      <View style={styles.avatarContainer}>
        <Image source={item.src} style={styles.avatar} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={avatars}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
          handleSwipe(index);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});

export default AvatarComponent;

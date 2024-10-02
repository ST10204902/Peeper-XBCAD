import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

const avatars = [
  { id: '1', src: require('../assets/Avatars/A1.png') },
  { id: '2', src: require('../assets/Avatars/A2.png') },
  { id: '3', src: require('../assets/Avatars/A3.png') },
  { id: '4', src: require('../assets/Avatars/A4.png') },
  { id: '5', src: require('../assets/Avatars/A5.png') },
  { id: '6', src: require('../assets/Avatars/A6.png') },
  { id: '7', src: require('../assets/Avatars/A7.png') },
  { id: '8', src: require('../assets/Avatars/A8.png') },
  { id: '9', src: require('../assets/Avatars/A9.png') },
];

const { width } = Dimensions.get('window');

const AvatarComponent = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const flatListRef = React.useRef<FlatList>(null);

  const handleSwipe = (index: number) => {
    setSelectedAvatar(index);
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  const renderItem = ({ item }: { item: { id: string; src: any } }) => {
    return (
      <View style={styles.avatarContainer}>
        <Image source={item.src} style={styles.avatar} />
      </View>
    );
  };

  const goNext = () => {
    if (selectedAvatar < avatars.length - 1) {
      handleSwipe(selectedAvatar + 1);
    }
  };

  const goPrev = () => {
    if (selectedAvatar > 0) {
      handleSwipe(selectedAvatar - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Arrow */}
      {selectedAvatar > 0 && (
        <TouchableOpacity style={styles.arrowLeft} onPress={goPrev}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={avatars}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item: { id: string; src: any }) => item.id}
        ref={flatListRef}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / width);
          setSelectedAvatar(index);
        }}
      />

      {/* Right Arrow */}
      {selectedAvatar < avatars.length - 1 && (
        <TouchableOpacity style={styles.arrowRight} onPress={goNext}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 300,
    height: 300,
    borderRadius: 75,
  },
  arrowLeft: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 20,
  },
  arrowRight: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderRadius: 20,
  },
  arrowText: {
    fontSize: 40,
    color: '#D3D3D3',
  },
});
export default AvatarComponent;

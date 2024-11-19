import React, { useState, useEffect } from "react";
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import AvatarArrowRight from "../assets/icons/AvatarArrowRight";
import AvatarArrowLeft from "../assets/icons/AvatarArrowLeft";
import { Colors } from "../styles/colors";
import A1 from "../assets/Avatars/A1.png";
import A2 from "../assets/Avatars/A2.png";
import A3 from "../assets/Avatars/A3.png";
import A4 from "../assets/Avatars/A4.png";
import A5 from "../assets/Avatars/A5.png";
import A6 from "../assets/Avatars/A6.png";
import A7 from "../assets/Avatars/A7.png";
import A8 from "../assets/Avatars/A8.png";
import A9 from "../assets/Avatars/A9.png";

interface AvatarSource {
  id: number;
  source: number;
  avatarId: string;
}

const avatars: AvatarSource[] = [
  { id: 1, source: A1, avatarId: "avatar_1" },
  { id: 2, source: A2, avatarId: "avatar_2" },
  { id: 3, source: A3, avatarId: "avatar_3" },
  { id: 4, source: A4, avatarId: "avatar_4" },
  { id: 5, source: A5, avatarId: "avatar_5" },
  { id: 6, source: A6, avatarId: "avatar_6" },
  { id: 7, source: A7, avatarId: "avatar_7" },
  { id: 8, source: A8, avatarId: "avatar_8" },
  { id: 9, source: A9, avatarId: "avatar_9" },
];

const { width } = Dimensions.get("window");

interface AvatarComponentProps {
  onAvatarSelected: (uri: string) => void;
  selectedAvatarURI: string;
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({
  onAvatarSelected,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedAvatarURI,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number>(0);
  const flatListRef = React.useRef<FlatList>(null);

  const handleSwipe = (index: number) => {
    setSelectedAvatar(index);
    flatListRef.current?.scrollToIndex({ animated: true, index });
  };

  useEffect(() => {
    // Call the callback function with the URI of the selected avatar
    onAvatarSelected(avatars[selectedAvatar].avatarId);
  }, [selectedAvatar, onAvatarSelected]);

  const renderItem = ({ item }: { item: { id: string; source: number } }) => {
    return (
      <View style={styles.avatarContainer}>
        <Image source={item.source} style={styles.avatar} />
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
          <AvatarArrowLeft size={50} color={Colors.textGray} />
        </TouchableOpacity>
      )}

      <FlatList
        data={avatars.map(avatar => ({
          id: avatar.id.toString(),
          source: avatar.source,
        }))}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item: { id: string; source: number }) => item.id}
        ref={flatListRef}
        onMomentumScrollEnd={event => {
          const index = Math.floor(event.nativeEvent.contentOffset.x / width);
          setSelectedAvatar(index);
        }}
      />

      {/* Right Arrow */}
      {selectedAvatar < avatars.length - 1 && (
        <TouchableOpacity style={styles.arrowRight} onPress={goNext}>
          <AvatarArrowRight size={50} color={Colors.textGray} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: -230,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 300,
    height: 300,
    borderRadius: 75,
  },
  arrowLeft: {
    position: "absolute",
    left: -5,
    top: "50%",
    transform: [{ translateY: -20 }],
    zIndex: 1,
    padding: 10,
    backgroundColor: Colors.transparent,
    borderRadius: 20,
  },
  arrowRight: {
    position: "absolute",
    right: -5,
    top: "50%",
    transform: [{ translateY: -20 }],
    zIndex: 1,
    padding: 10,
    backgroundColor: Colors.transparent,
    borderRadius: 20,
  },
});

export default AvatarComponent;

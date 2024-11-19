import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  ImageSourcePropType,
  SafeAreaView,
} from "react-native";
import { useCurrentStudent } from "../../hooks/useCurrentStudent";
import { useTheme } from "../../styles/ThemeContext";
import { lightTheme, darkTheme } from "../../styles/themes";
import { AvatarUtility } from "../../utils/AvatarUtility";
import { Colors } from "../../styles/colors";
import A1 from "../../assets/Avatars/A1.png";
import A2 from "../../assets/Avatars/A2.png";
import A3 from "../../assets/Avatars/A3.png";
import A4 from "../../assets/Avatars/A4.png";
import A5 from "../../assets/Avatars/A5.png";
import A6 from "../../assets/Avatars/A6.png";
import A7 from "../../assets/Avatars/A7.png";
import A8 from "../../assets/Avatars/A8.png";
import A9 from "../../assets/Avatars/A9.png";

const AVATARS = [
  { id: 1, source: A1 },
  { id: 2, source: A2 },
  { id: 3, source: A3 },
  { id: 4, source: A4 },
  { id: 5, source: A5 },
  { id: 6, source: A6 },
  { id: 7, source: A7 },
  { id: 8, source: A8 },
  { id: 9, source: A9 },
] as const;

const valuePairs = {
  1: "avatar_1",
  2: "avatar_2",
  3: "avatar_3",
  4: "avatar_4",
  5: "avatar_5",
  6: "avatar_6",
  7: "avatar_7",
  8: "avatar_8",
  9: "avatar_9",
};

interface AvatarComponentProps {
  onAvatarSelected?: (uri: string) => void;
  selectedAvatarURI?: string;
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({
  onAvatarSelected = () => {},
  selectedAvatarURI,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const { currentStudent, updateCurrentStudent } = useCurrentStudent();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    if (selectedAvatarURI !== null && selectedAvatarURI !== undefined && selectedAvatarURI !== "") {
      // eslint-disable-next-line no-console
      console.log(selectedAvatarURI);
    }
  }, [selectedAvatarURI, currentStudent?.profilePhotoId]);

  useEffect(() => {
    if (
      currentStudent?.profilePhotoId !== null &&
      currentStudent?.profilePhotoId !== undefined &&
      currentStudent?.profilePhotoId !== ""
    ) {
      const avatar = AVATARS.find(
        a => valuePairs[a.id as keyof typeof valuePairs] === currentStudent.profilePhotoId,
      );
      if (avatar) {
        setSelectedAvatar(avatar.id);
      }
    }
  }, [currentStudent]);

  const handleAvatarPress = async (id: number, _source: ImageSourcePropType) => {
    setSelectedAvatar(id);
    const avatarId = `avatar_${id}`;
    if (typeof onAvatarSelected === "function") {
      onAvatarSelected(avatarId);
    }
    await updateCurrentStudent({ profilePhotoId: avatarId });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.componentBackground }]}>
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: theme.componentBackground }]}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={[styles.title, { color: theme.fontRegular }]}>CUSTOMIZE PROFILE</Text>
        <Text style={[styles.subtitle, { color: theme.fontRegular }]}>Avatar</Text>

        <View style={styles.previewContainer}>
          {selectedAvatar !== null && selectedAvatar !== 0 ? (
            <Image
              source={AVATARS.find(a => a.id === selectedAvatar)?.source}
              style={styles.selectedAvatar}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.selectedAvatar,
                styles.placeholderAvatar,
                { backgroundColor: theme.componentBackground },
              ]}
            >
              {currentStudent?.profilePhotoId !== null &&
                currentStudent?.profilePhotoId !== undefined &&
                currentStudent?.profilePhotoId !== "" && (
                  <Image
                    source={AvatarUtility.getAvatarSource(currentStudent.profilePhotoId)}
                    style={styles.selectedAvatar}
                    resizeMode="contain"
                  />
                )}
            </View>
          )}
        </View>

        <View style={[styles.selectionBackground, { backgroundColor: theme.componentBackground }]}>
          <View style={styles.gridContainer}>
            {AVATARS.map(avatar => (
              <TouchableOpacity
                key={avatar.id}
                onPress={() => handleAvatarPress(avatar.id, avatar.source)}
                style={styles.avatarButton}
              >
                <Image
                  source={avatar.source}
                  style={[
                    styles.avatarImage,
                    ...(selectedAvatar !== null &&
                    selectedAvatar !== 0 &&
                    selectedAvatar === avatar.id
                      ? [styles.grayscale]
                      : []),
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.pageBackground,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    alignSelf: "flex-start",
    marginTop: 30,
    marginBottom: 4,
    fontFamily: "Quittance",
  },
  subtitle: {
    fontSize: 18,
    alignSelf: "flex-start",
    marginBottom: 16,
    fontFamily: "Rany-Bold",
  },
  previewContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  selectedAvatar: {
    width: 200, // Explicitly set the width
    height: 200, // Explicitly set the height
    borderRadius: 100, // Ensure the border radius matches the size for a circular avatar
  },
  placeholderAvatar: {
    backgroundColor: Colors.placeholderBackground,
  },
  selectionBackground: {
    backgroundColor: Colors.selectionBackground,
    borderRadius: 20,
    padding: 16,
    width: "100%",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  avatarButton: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 15,
    marginBottom: 8,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  grayscale: {
    opacity: 0.5,
  },
});
export default AvatarComponent;

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, ScrollView } from 'react-native';
import { useCurrentStudent } from '../../hooks/useCurrentStudent';
import { useTheme } from '../../styles/ThemeContext';
import { lightTheme, darkTheme } from '../../styles/themes';

const AVATARS = [
  { id: 1, source: require('../../assets/Avatars/A1.png') },
  { id: 2, source: require('../../assets/Avatars/A2.png') },
  { id: 3, source: require('../../assets/Avatars/A3.png') },
  { id: 4, source: require('../../assets/Avatars/A4.png') },
  { id: 5, source: require('../../assets/Avatars/A5.png') },
  { id: 6, source: require('../../assets/Avatars/A6.png') },
  { id: 7, source: require('../../assets/Avatars/A7.png') },
  { id: 8, source: require('../../assets/Avatars/A8.png') },
  { id: 9, source: require('../../assets/Avatars/A9.png') },
];

const valuePairs = {
  1: "../assets/Avatars/A1.png",
  2: "../assets/Avatars/A2.png",
  3: "../assets/Avatars/A3.png",
  4: "../assets/Avatars/A4.png",
  5: "../assets/Avatars/A5.png",
  6: "../assets/Avatars/A6.png",
  7: "../assets/Avatars/A7.png",
  8: "../assets/Avatars/A8.png",
  9: "../assets/Avatars/A9.png",
};

interface AvatarComponentProps {
  onAvatarSelected?: (uri: string) => void; // Make the prop optional
  selectedAvatarURI?: string; // Add the selectedAvatarURI prop
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({ onAvatarSelected = () => {}, selectedAvatarURI }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const { currentStudent, updateCurrentStudent } = useCurrentStudent();
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    if (selectedAvatarURI) {
      console.log(selectedAvatarURI);
    }
  }, [selectedAvatarURI, currentStudent?.profilePhotoURL]);

  useEffect(() => {
    if (currentStudent?.profilePhotoURL) {
      const avatar = AVATARS.find(a => valuePairs[a.id] === currentStudent.profilePhotoURL);
      if (avatar) {
        setSelectedAvatar(avatar.id);
      }
    }
  }, [currentStudent]);

  const handleAvatarPress = async (id: number, source: any) => {
    console.log(id);
    setSelectedAvatar(id);
    onAvatarSelected(Image.resolveAssetSource(source).uri);
    const selected = AVATARS.find((avatar) => avatar.id === id);
    console.log(selected);
    if (selected) {
      setSelectedAvatar(selected.id);
      const newAvatar = valuePairs[selected.id as keyof typeof valuePairs];
      console.log(newAvatar);
      await updateCurrentStudent({ profilePhotoURL: newAvatar });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      {/* Title */}
      <Text style={[styles.title, { color: theme.fontRegular }]}>CUSTOMIZE PROFILE</Text>
      <Text style={[styles.subtitle, { color: theme.fontRegular }]}>Avatar</Text>

      {/* Selected Avatar Preview */}
      <View style={styles.previewContainer}>
        {selectedAvatar ? (
          <Image
            source={AVATARS.find(a => a.id === selectedAvatar)?.source}
            style={styles.selectedAvatar}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.selectedAvatar, styles.placeholderAvatar, { backgroundColor: theme.componentBackground }]}>
            {currentStudent?.profilePhotoURL && (
              <Image
                source={{ uri: currentStudent.profilePhotoURL }}
                style={styles.selectedAvatar}
                resizeMode="contain"
              />
            )}
          </View>
        )}
      </View>

      {/* Avatar Selection Background */}
      <View style={[styles.selectionBackground, { backgroundColor: theme.componentBackground }]}>
        {/* Avatar Grid */}
        <View style={styles.gridContainer}>
          {AVATARS.map((avatar) => (
            <TouchableOpacity
              key={avatar.id}
              onPress={() => handleAvatarPress(avatar.id, avatar.source)}
              style={styles.avatarButton}
            >
              <Image
                source={avatar.source}
                style={[
                  styles.avatarImage,
                  ...(selectedAvatar && selectedAvatar === avatar.id ? [styles.grayscale] : [])
                ]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    alignSelf: 'flex-start',
    marginTop: 30,
    marginBottom: 4,
    fontFamily: 'Quittance',
  },
  subtitle: {
    fontSize: 18,
    alignSelf: 'flex-start',
    marginBottom: 16,
    fontFamily: 'Rany-Bold',
  },
  previewContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedAvatar: {
    width: 200, // Explicitly set the width
    height: 200, // Explicitly set the height
    borderRadius: 100, // Ensure the border radius matches the size for a circular avatar
  },
  placeholderAvatar: {
    backgroundColor: '#f0f0f0',
  },
  selectionBackground: {
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    padding: 16,
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  avatarButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 15,
    marginBottom: 8,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  grayscale: {
    opacity: 0.5,
  },
});

export default AvatarComponent;
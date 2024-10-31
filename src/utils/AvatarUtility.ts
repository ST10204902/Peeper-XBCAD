
export const AvatarUtility = {
    getAvatarSource: (avatarId: string) => {
      const avatarMap: { [key: string]: any } = {
        'avatar_1': require('../assets/Avatars/A1.png'),
        'avatar_2': require('../assets/Avatars/A2.png'),
        'avatar_3': require('../assets/Avatars/A3.png'),
        'avatar_4': require('../assets/Avatars/A4.png'),
        'avatar_5': require('../assets/Avatars/A5.png'),
        'avatar_6': require('../assets/Avatars/A6.png'),
        'avatar_7': require('../assets/Avatars/A7.png'),
        'avatar_8': require('../assets/Avatars/A8.png'),
        'avatar_9': require('../assets/Avatars/A9.png'),
      };
      return avatarMap[avatarId] || avatarMap['avatar_1']; // Default to first avatar
    }
  };
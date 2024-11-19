// Import all avatar images
import A1 from "../assets/Avatars/A1.png";
import A2 from "../assets/Avatars/A2.png";
import A3 from "../assets/Avatars/A3.png";
import A4 from "../assets/Avatars/A4.png";
import A5 from "../assets/Avatars/A5.png";
import A6 from "../assets/Avatars/A6.png";
import A7 from "../assets/Avatars/A7.png";
import A8 from "../assets/Avatars/A8.png";
import A9 from "../assets/Avatars/A9.png";

type AvatarMapType = {
  [key: string]: typeof A1;
};

export const AvatarUtility = {
  getAvatarSource: (avatarId: string) => {
    const avatarMap: AvatarMapType = {
      avatar_1: A1,
      avatar_2: A2,
      avatar_3: A3,
      avatar_4: A4,
      avatar_5: A5,
      avatar_6: A6,
      avatar_7: A7,
      avatar_8: A8,
      avatar_9: A9,
    };

    return avatarMap[avatarId] ?? avatarMap.avatar_1; // Using nullish coalescing and dot notation
  },
};

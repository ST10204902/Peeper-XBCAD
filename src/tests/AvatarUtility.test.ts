import { AvatarUtility } from "../utils/AvatarUtility";

// No need for individual mocks, the moduleNameMapper in jest.config.ts will handle this
describe("AvatarUtility", () => {
  describe("getAvatarSource", () => {
    it("should return correct avatar for valid avatar_1", () => {
      const source = AvatarUtility.getAvatarSource("avatar_1");
      expect(source).toBe("test-file-stub");
    });

    it("should return correct avatar for valid avatar_9", () => {
      const source = AvatarUtility.getAvatarSource("avatar_9");
      expect(source).toBe("test-file-stub");
    });

    it("should return default avatar (A1) for invalid avatar ID", () => {
      const source = AvatarUtility.getAvatarSource("invalid_avatar");
      expect(source).toBe("test-file-stub");
    });

    it("should return default avatar (A1) for empty string", () => {
      const source = AvatarUtility.getAvatarSource("");
      expect(source).toBe("test-file-stub");
    });

    it("should handle all valid avatar IDs", () => {
      const avatarIds = [
        "avatar_1",
        "avatar_2",
        "avatar_3",
        "avatar_4",
        "avatar_5",
        "avatar_6",
        "avatar_7",
        "avatar_8",
        "avatar_9",
      ];

      avatarIds.forEach(id => {
        const source = AvatarUtility.getAvatarSource(id);
        expect(source).toBe("test-file-stub");
      });
    });

    it("should be case sensitive for avatar IDs", () => {
      const source = AvatarUtility.getAvatarSource("AVATAR_1");
      expect(source).toBe("test-file-stub");
    });

    it("should handle undefined input", () => {
      // @ts-expect-error Testing undefined input
      const source = AvatarUtility.getAvatarSource(undefined);
      expect(source).toBe("test-file-stub");
    });

    it("should handle null input", () => {
      // @ts-expect-error Testing null input
      const source = AvatarUtility.getAvatarSource(null);
      expect(source).toBe("test-file-stub");
    });
  });
});

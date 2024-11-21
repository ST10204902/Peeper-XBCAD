// src/components/FontLoader.tsx
import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import { ActivityIndicator, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Import font files
import InterBlack from "../assets/fonts/Inter-Black.otf";
import InterBold from "../assets/fonts/Inter-Bold.otf";
import InterMedium from "../assets/fonts/Inter-Medium.otf";
import InterRegular from "../assets/fonts/Inter-Regular.otf";
import Quittance from "../assets/fonts/Quittance.otf";

interface FontLoaderProps {
  children: React.ReactNode;
}

export default function FontLoader({ children }: FontLoaderProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = useCallback(async () => {
    try {
      await SplashScreen.preventAutoHideAsync();

      // Load fonts without the problematic Inter.ttc
      await Font.loadAsync({
        "Inter-Black": InterBlack,
        "Inter-Bold": InterBold,
        "Rany-Medium": InterMedium,
        "Inter-Regular": InterRegular,
        Quittance: Quittance,
      });

      setFontsLoaded(true);
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error("Error loading fonts:", error);
    }
  }, []);

  useEffect(() => {
    loadFonts();
  }, [loadFonts]);

  if (!fontsLoaded) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

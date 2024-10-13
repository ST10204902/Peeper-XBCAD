// src/components/FontLoader.tsx
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Prevent the splash screen from auto-hiding
        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          "Rany-Medium": require("../assets/fonts/Rany-Medium.otf"),
          "Quittance": require("../assets/fonts/Quittance.otf"),
        });

        setFontsLoaded(true);
        // Hide the splash screen once fonts are loaded
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return <>{children}</>;
};

export default FontLoader;

// src/components/FontLoader.tsx
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Rany-Medium": require("../assets/fonts/Rany-Medium.otf"),
        "Rany-Bold": require("../assets/fonts/Rany-Bold.otf"),
        Quinttance: require("../assets/fonts/Quittance.otf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <>{children}</>;
};

export default FontLoader;

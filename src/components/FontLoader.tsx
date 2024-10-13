// src/components/FontLoader.tsx
import React, { useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

/**
 * FontLoader component is responsible for loading custom fonts asynchronously
 * and preventing the splash screen from hiding until the fonts are loaded.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered once fonts are loaded.
 *
 * @returns {React.ReactNode} The child components if fonts are loaded, otherwise null.
 *
 * @example
 * <FontLoader>
 *   <App />
 * </FontLoader>
 */
const FontLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

        //Loading in the custom fonts
        await Font.loadAsync({
          "Rany-Medium": require("../assets/fonts/Rany-Medium.otf"), 
          "Quittance": require("../assets/fonts/Quittance.otf"),
        });

        setFontsLoaded(true);
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

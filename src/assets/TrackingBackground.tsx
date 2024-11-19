import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";

export default function TrackingBackground() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          theme.background,
          theme.background, // First light stripe
          theme.componentBackground,
          theme.componentBackground, // First dark stripe
          theme.background,
          theme.background, // Second light stripe
          theme.componentBackground,
          theme.componentBackground, // Second dark stripe
          theme.background,
          theme.background, // Third light stripe
          theme.componentBackground,
          theme.componentBackground, // Third dark stripe
          theme.background,
          theme.background, // Fourth light stripe
        ]}
        start={{ x: 0, y: 0 }} // Start the gradient partially across the view
        end={{ x: 1, y: 2 }} // Continue to bottom-right corner
        locations={[
          0,
          0.15, // First light stripe (15% of the space)
          0.15,
          0.3, // First dark stripe (15% of the space)
          0.3,
          0.45, // Second light stripe (15% of the space)
          0.45,
          0.6, // Second dark stripe (15% of the space)
          0.6,
          0.75, // Third light stripe (15% of the space)
          0.75,
          0.9, // Third dark stripe (15% of the space)
          0.9,
          1.0, // Fourth light stripe (remaining 10% of the space)
        ]}
        style={styles.background}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
  },
  background: {
    flex: 1,
    borderRadius: 35,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
  },
});

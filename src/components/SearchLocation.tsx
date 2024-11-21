import { useRef, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import PlacesInput from "react-native-places-input";
import { useTheme } from "../styles/ThemeContext";
import { lightTheme, darkTheme } from "../styles/themes";
import { Colors } from "../styles/colors";

interface Props {
  handlePlaceUpdated: (place: string, coordinate: { latitude: number; longitude: number }) => void;
}

/**
 * SearchLocation component provides a location search and selection interface.
 *
 * This component allows users to search for a location using the Google Places API, display the selected location on a map, and place a marker at the    selected coordinates. It includes an autocomplete input field and a map view.
 *
 * @component
 * @param {Props} props - Props containing a function to handle place updates.
 * @returns {JSX.Element} The rendered SearchLocation component.
 *
 * @example
 * // Usage example:
 * <SearchLocation handlePlaceUpdated={(place) => console.log(place)} />
 *
 * @remarks
 * - Requires a valid Google Maps API key to function.
 * - Updates the map's region and adds a marker to the map based on the selected place.
 * - Includes keyboard handling with `KeyboardAvoidingView` for a smooth user experience on iOS.
 *
 * @function
 * @name SearchLocation
 *
 * @param {function} handlePlaceUpdated - Callback function to handle updates when a place is selected.
 * `place` is in the format: Street Address, Suburb, City, Postal Code, Country
 *
 * @hook
 * @name useState
 * @description Manages the state for the marker's coordinates.
 *
 * @hook
 * @name useRef
 * @description Provides a reference to the MapView component for controlling the map's region.
 *
 * @state {Object | null} markerCoordinate - The coordinates of the marker on the map.
 *
 * @throws Will throw an error if the Google Maps API key is missing.
 */
export default function SearchLocation({ handlePlaceUpdated }: Props) {
  const [markerCoordinate, setMarkerCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const mapRef = useRef<MapView>(null);
  const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  if (googleApiKey === null || googleApiKey === undefined) {
    throw new Error(
      "Missing Google API Key. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your .env",
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.fontRegular }]}>Location</Text>

      <PlacesInput
        googleApiKey={googleApiKey}
        placeHolder="Enter Address"
        onSelect={place => {
          const location = place.result?.geometry?.location || place?.geometry?.location;

          if (location?.lat == null || !location?.lng) {
            console.error("Place details are missing geometry data.");
            return;
          }

          if (!location?.lat || !location?.lng) {
            console.error("Place details are missing geometry data.");
            return;
          }
          const { lat, lng } = location;

          const newRegion = {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          };
          const coordinate = { latitude: lat, longitude: lng };
          setMarkerCoordinate(coordinate);

          if (mapRef.current !== null) {
            mapRef.current.animateToRegion(newRegion, 1000);
            if (place.result?.formatted_address !== undefined) {
              handlePlaceUpdated(place.result.formatted_address, coordinate);
            } else {
              console.error("Place details are missing formatted address.");
            }
          }
        }}
        stylesInput={styles.input}
        stylesList={{
          ...styles.list,
          backgroundColor: theme.componentBackground,
        }}
        stylesItem={{
          ...styles.item,
          color: theme.fontRegular,
        }}
      />

      <View style={styles.mapContainer}>
        <MapView
          pointerEvents="none"
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: -33.9249,
            longitude: 18.4241,
            latitudeDelta: 0.15,
            longitudeDelta: 0.121,
          }}
        >
          {markerCoordinate && <Marker coordinate={markerCoordinate} />}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 20,
    fontFamily: "Rany-Bold",
    color: Colors.textGray,
    marginBottom: 10,
    marginLeft: 35,
  },
  input: {
    marginTop: 20,
    marginStart: 5,
    borderRadius: 15,
    fontFamily: "Rany-Medium",
    paddingStart: 30,
    fontSize: 16,
    height: 50,
    zIndex: 2,
  },
  list: {
    // styles for the suggestions list
  },
  item: {
    // styles for each suggestion item
  },
  mapContainer: {
    height: 200,
    marginTop: 50,
    marginBottom: 10,
  },
  map: {
    flex: 1,
    zIndex: 1,
  },
});

import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import PlacesInput from "react-native-places-input";

interface Props {
  handlePlaceUpdated: (place: string) => void;
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

  if (!googleApiKey) {
    throw new Error(
      "Missing Google API Key. Please set EXPO_PUBLIC_GOOGLE_MAPS_API_KEY in your .env"
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Autocomplete Input */}
      <Text style={styles.label}>Location</Text>

      <PlacesInput
        googleApiKey={googleApiKey}
        placeHolder="Enter Address"
        onSelect={(place) => {
          const location =
            place.result?.geometry?.location || place?.geometry?.location;

          if (location) {
            const { lat, lng } = location;

            const newRegion = {
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            };

            setMarkerCoordinate({ latitude: lat, longitude: lng });

            if (mapRef.current) {
              mapRef.current.animateToRegion(newRegion, 1000);
              handlePlaceUpdated(place.result.formatted_address);
            }
          } else {
            console.error("Place details are missing geometry data.");
          }
        }}
        stylesInput={styles.input}
        stylesList={styles.list}
        stylesItem={styles.item}
      />

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          {markerCoordinate && <Marker coordinate={markerCoordinate} />}
        </MapView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 100,
  },
  label: {
    fontSize: 20,
    fontFamily: "Rany-Bold",
    color: "#4A4A4A",
    paddingLeft: 15,
    marginBottom: 10,
  },
  input: {
    marginLeft: -10,
    marginTop: 20,
    backgroundColor: "#EBEBEB",
    marginStart: 0,
    borderRadius: 15,
    fontFamily: "Rany-Medium",
    paddingStart: 30,
    fontSize: 16,
    color: "#5A5A5A",
    height: 50,
  },
  list: {
    backgroundColor: "#F9F9F9",
  },
  item: {
    // Your custom styles for each suggestion item
  },
  mapContainer: {
    flex: 1,
    marginTop: 50,
    marginBottom: 10,
    marginHorizontal: -16,
  },
  map: {
    flex: 1,
  },
});

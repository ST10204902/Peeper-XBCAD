import React, { ReactNode, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { OrgAddressData } from "../databaseModels/OrgAddressData";
import * as Location from "expo-location";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!;

/**
 * @orgName name of the organisation
 * @orgAddress address of the organisation
 * @oddOrEven used to make the alternating grey white pattern for the items
 * @listButton button to be rendered inside of the item when expanded
 */
interface Props {
  orgName: string;
  orgAddress: OrgAddressData;
  oddOrEven: "odd" | "even";
  listButton: ReactNode;
  userLocation?: Location.LocationObject;
}

/**
 * Creates an ExpandableOrgListItem component
 * @param orgName name of the organisation
 * @param orgAddress address of the organisation
 * @param oddOrEven used to make the alternating grey white pattern for the items
 * @param listButton button to be rendered inside of the item when expanded
 * @returns An ExpandableOrgListItem component
 */
export default function ExpandableOrgListItem({
  orgName,
  orgAddress,
  oddOrEven,
  listButton,
  userLocation,
}: Props) {
  // Odd even code
  const containerStyle =
    oddOrEven === "odd" ? styles.itemContainerOdd : styles.itemContainerEven;
  const expandedContainerStyle =
    oddOrEven === "odd"
      ? expandedStyles.itemContainerOdd
      : expandedStyles.itemContainerEven;

  // Hook for setting the expanded state of the item
  const [expanded, setExpanded] = useState(false);
  const [distanceInKm, setDistanceInKm] = useState<string>('0');
  const [validDistance, setValidDistance] = useState<boolean>(false);

   // Function to format the address for the API
   function formatAddress(orgAddress: OrgAddressData): string {
    const { streetAddress, suburb, city, province, postalCode } = orgAddress;
    return `${streetAddress}, ${suburb}, ${city}, ${province}, ${postalCode}`;
  }

  useEffect(() => {
    const getDistance = async () => {
      if (userLocation && orgAddress) {
        try {
          const origin = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
          const destination = encodeURIComponent(formatAddress(orgAddress));

          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=${GOOGLE_MAPS_API_KEY}`;

          const response = await fetch(url);
          const data = await response.json();

          if (data.status === 'OK') {
            const element = data.rows[0].elements[0];
            if (element.status === 'OK') {
              const distance = element.distance.value; // in meters
              const distanceInKm = (distance / 1000).toFixed(1); // Round to 1 decimal place
              setDistanceInKm(distanceInKm);
              setValidDistance(true);
            } else {
              console.error('Distance Matrix API error:', element.status);
              setValidDistance(false);
            }
          } else {
            console.error('Distance Matrix API error:', data.status);
            setValidDistance(false);
          }
        } catch (error) {
          console.error('Error fetching distance:', error);
          setValidDistance(false);
        }
      }
    };

    getDistance();
  }, [userLocation, orgAddress]);

  return !expanded ? (
    <View style={containerStyle} onTouchEnd={() => setExpanded(true)}>
      <Text style={styles.orgName}>{orgName}</Text>
      {validDistance && <Text style={styles.distance}>{distanceInKm}km</Text>}
    </View>
  ) : (
    <View style={expandedContainerStyle} onTouchEnd={() => setExpanded(false)}>
      <View style={expandedStyles.firstRow}>
        <Text style={expandedStyles.orgName}>{orgName}</Text>
        {validDistance && <Text style={styles.distance}>{distanceInKm}km</Text>}
      </View>

      <Text style={expandedStyles.addressRow}>
        {`${orgAddress.streetAddress}, ${orgAddress.suburb}, ${orgAddress.city}, ${orgAddress.province}, ${orgAddress.postalCode}`}
      </Text>

      <View style={expandedStyles.buttonContainer}>{listButton}</View>
    </View>
  );
}

/**
 * Styles for the unexpanded list item
 */
const styles = StyleSheet.create({
  itemContainerOdd: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E7E7E7",
    gap: 10,
  },
  itemContainerEven: {
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#00000000",
    gap: 10,
  },
  orgName: {
    color: "#161616",
    paddingVertical: 15,
    marginStart: 30,
    fontWeight: "600",
    fontSize: 18,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  distance: {
    color: "#696969",
    fontWeight: "regular",
    marginEnd: 11,
    fontSize: 17,
    alignSelf: "flex-end",
  },
});

/**
 * Styles for the expanded list item
 */
const expandedStyles = StyleSheet.create({
  itemContainerOdd: {
    paddingVertical: 5,
    backgroundColor: "#E7E7E7",
  },
  itemContainerEven: {
    paddingVertical: 5,

    backgroundColor: "#00000000",
  },
  firstRow: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  orgName: {
    paddingStart: 30,
    color: "#161616",
    fontWeight: "600",
    fontSize: 18,
    flexShrink: 1,
    flexWrap: "wrap",
    textAlign: "left",
  },
  addressRow: {
    marginVertical: 10,
    marginHorizontal: 40,
    fontSize: 15,
    alignSelf: "center",
  },
  distance: {
    color: "#696969",
    fontWeight: "regular",
    marginEnd: 11,
    fontSize: 17,
    alignSelf: "flex-start",
  },
  buttonContainer: {
    paddingHorizontal: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
});
// End of File

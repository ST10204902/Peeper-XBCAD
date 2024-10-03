import React, { useRef, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import MapComponent from "../components/MapComponent";
import OrganisationListItem from "../components/OrganisationListItem";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";


export default function LandingScreen() {
  const organisations: Organisation[] = [
    {
      org_id: "1",
      orgName: "Ladles of Love",
      orgAddress: {
        streetAddress: "223 Long St",
        suburb: "Cape Town City Centre",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
      },
      orgEmail: "info@ladlesoflove.org",
      orgPhoneNo: "0211234567",
      orgLatitude: -33.925839,
      orgLongitude: 18.423222,
    },
    {
      org_id: "2",
      orgName: "Reach for a Dream",
      orgAddress: {
        streetAddress: "123 Kloof St",
        suburb: "Gardens",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
      },
      orgEmail: "contact@reachforadream.org",
      orgPhoneNo: "0212345678",
      orgLatitude: -33.933333,
      orgLongitude: 18.408889,
    },
    {
      org_id: "3",
      orgName: "The Haven Night Shelter",
      orgAddress: {
        streetAddress: "20 Napier St",
        suburb: "Green Point",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8005",
      },
      orgEmail: "info@haven.org",
      orgPhoneNo: "0213456789",
      orgLatitude: -33.914444,
      orgLongitude: 18.413611,
    },
    {
      org_id: "4",
      orgName: "Rainbow of Hope",
      orgAddress: {
        streetAddress: "10 1st Ave",
        suburb: "Boston",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7530",
      },
      orgEmail: "support@rainbowofhope.org",
      orgPhoneNo: "0214567890",
      orgLatitude: -33.898889,
      orgLongitude: 18.63,
    },
    {
      org_id: "5",
      orgName: "Habitat for Humanity",
      orgAddress: {
        streetAddress: "80 Strand St",
        suburb: "Cape Town City Centre",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
      },
      orgEmail: "info@habitat.org",
      orgPhoneNo: "0215678901",
      orgLatitude: -33.92,
      orgLongitude: 18.425833,
    },
    {
      org_id: "6",
      orgName: "Cape Town Animal Welfare",
      orgAddress: {
        streetAddress: "Lansdowne Rd",
        suburb: "Ottery",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7800",
      },
      orgEmail: "contact@cawf.org",
      orgPhoneNo: "0216789012",
      orgLatitude: -34.000556,
      orgLongitude: 18.512778,
    },
    {
      org_id: "7",
      orgName: "Red Cross Children's Hospital Trust",
      orgAddress: {
        streetAddress: "Klipfontein Rd",
        suburb: "Rondebosch",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7700",
      },
      orgEmail: "info@childrenshospitaltrust.org",
      orgPhoneNo: "0217890123",
      orgLatitude: -33.956944,
      orgLongitude: 18.485278,
    },
    {
      org_id: "8",
      orgName: "Cape Town Society for the Blind",
      orgAddress: {
        streetAddress: "45 Salt River Rd",
        suburb: "Salt River",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7925",
      },
      orgEmail: "info@ctsb.org",
      orgPhoneNo: "0218901234",
      orgLatitude: -33.926389,
      orgLongitude: 18.452222,
    },
    {
      org_id: "9",
      orgName: "St. Anne's Homes",
      orgAddress: {
        streetAddress: "48 Balfour St",
        suburb: "Woodstock",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7925",
      },
      orgEmail: "info@stannes.org",
      orgPhoneNo: "0219012345",
      orgLatitude: -33.924167,
      orgLongitude: 18.440278,
    },
    {
      org_id: "10",
      orgName: "The Amy Foundation",
      orgAddress: {
        streetAddress: "28 Kent St",
        suburb: "Woodstock",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7925",
      },
      orgEmail: "info@amyfoundation.org",
      orgPhoneNo: "0219123456",
      orgLatitude: -33.929167,
      orgLongitude: 18.453333,
    },
    {
      org_id: "11",
      orgName: "Love Cape Town City Mission",
      orgAddress: {
        streetAddress: "10 Alexander St",
        suburb: "Goodwood",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7460",
      },
      orgEmail: "info@lovecapetown.org",
      orgPhoneNo: "0217893456",
      orgLatitude: -33.91,
      orgLongitude: 18.5675,
    },
    {
      org_id: "12",
      orgName: "Cape Mental Health",
      orgAddress: {
        streetAddress: "22 Ivy St",
        suburb: "Observatory",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7925",
      },
      orgEmail: "contact@capementalhealth.org",
      orgPhoneNo: "0219015678",
      orgLatitude: -33.937778,
      orgLongitude: 18.4725,
    },
    {
      org_id: "13",
      orgName: "CANSA Cape Metro",
      orgAddress: {
        streetAddress: "26 Belgravia Rd",
        suburb: "Athlone",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7764",
      },
      orgEmail: "info@cansa.org",
      orgPhoneNo: "0212348901",
      orgLatitude: -33.95,
      orgLongitude: 18.515,
    },
    {
      org_id: "14",
      orgName: "Hope House Counselling Centre",
      orgAddress: {
        streetAddress: "20 Tokai Rd",
        suburb: "Tokai",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7945",
      },
      orgEmail: "info@hopehouse.org",
      orgPhoneNo: "0217896789",
      orgLatitude: -34.046944,
      orgLongitude: 18.448056,
    },
    {
      org_id: "15",
      orgName: "Ons Plek Projects",
      orgAddress: {
        streetAddress: "7th Avenue",
        suburb: "Belgravia",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7764",
      },
      orgEmail: "info@onsplek.org",
      orgPhoneNo: "0216789123",
      orgLatitude: -33.949722,
      orgLongitude: 18.517222,
    },
    {
      org_id: "16",
      orgName: "Friends of the Children's Hospital",
      orgAddress: {
        streetAddress: "Rondebosch Medical Centre",
        suburb: "Rondebosch",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7700",
      },
      orgEmail: "contact@foch.org",
      orgPhoneNo: "0213456789",
      orgLatitude: -33.96,
      orgLongitude: 18.480833,
    },
    {
      org_id: "17",
      orgName: "UCT Children's Institute",
      orgAddress: {
        streetAddress: "46 Sawkins Rd",
        suburb: "Rondebosch",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7700",
      },
      orgEmail: "info@uctchildren.org",
      orgPhoneNo: "0219017890",
      orgLatitude: -33.960833,
      orgLongitude: 18.479444,
    },
    {
      org_id: "18",
      orgName: "Cape Town Child Welfare",
      orgAddress: {
        streetAddress: "20 3rd St",
        suburb: "Athlone",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "7764",
      },
      orgEmail: "info@ctcw.org",
      orgPhoneNo: "0214567890",
      orgLatitude: -33.953333,
      orgLongitude: 18.508611,
    },
    {
      org_id: "19",
      orgName: "Fikelela Aids Project",
      orgAddress: {
        streetAddress: "40 Bree St",
        suburb: "Cape Town City Centre",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
      },
      orgEmail: "info@fikelela.org",
      orgPhoneNo: "0217891234",
      orgLatitude: -33.920833,
      orgLongitude: 18.418611,
    },
    {
      org_id: "20",
      orgName: "The Cape Leopard Trust",
      orgAddress: {
        streetAddress: "15 Spin St",
        suburb: "Cape Town City Centre",
        city: "Cape Town",
        province: "Western Cape",
        postalCode: "8001",
      },
      orgEmail: "contact@capeleopard.org",
      orgPhoneNo: "0219012345",
      orgLatitude: -33.924444,
      orgLongitude: 18.418333,
    },
  ];

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const sheetRef = useRef<BottomSheet>(null);

  // Define snap points (different heights the bottom sheet can snap to)
  const snapPoints = useMemo(() => [100, "50%", "100%"], []);

  // Function to handle organisation item click
  const handleOrganisationPress = (
    latitude: number,
    longitude: number,
    organisationName: String
  ) => {
    setSelectedLocation({ latitude, longitude });
    console.log(`${organisationName} selected`);
  };

  const renderItem = ({ item, index }: { item: Organisation; index: number }) => (
    <OrganisationListItem
      orgName={item.orgName}
      oddOrEven={index % 2 === 0 ? "even" : "odd"} // Alternate between 'odd' and 'even'
      onPress={() => {
        handleOrganisationPress(item.orgLatitude, item.orgLongitude, item.orgName);
        console.log("Pressed:", item.orgName);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Component */}
      <MapComponent selectedLocation={selectedLocation} />
      {/* Bottom Sheet for Organisation List */}
      <BottomSheet
        ref={sheetRef}
        index={0} // Initial position (0 = collapsed)
        snapPoints={snapPoints} // Snap points for the bottom sheet
        enablePanDownToClose={false} // Prevent closing with a swipe down
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetHeading}>Organisation List</Text>
        </View>

        {/* Scrollable Organisation List */}
        <BottomSheetFlatList
          data={organisations}
          keyExtractor={(item) => item.org_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContentContainer}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sheetHeader: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  sheetHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#161616", // White text
    marginBottom: 10,
  },
  listContentContainer: {
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

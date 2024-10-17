import { Alert, StyleSheet, Text, View } from "react-native";
import AvatarComponent from "../components/AvatarComponent";
import CustomButton from "../components/CustomButton";
import { useState } from "react";
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { RootStackParamsList } from "./RootStackParamsList";
import { SafeAreaView } from "react-native-safe-area-context";

function RegisterProfilePhotoScreen() {
  const [avatarURI, setAvatarURI] = useState("");

  // Getting student from navigation
  const route =
    useRoute<RouteProp<RootStackParamsList, "RegisterProfilePhotoScreen">>();
  const navigation =
    useNavigation<NavigationProp<RootStackParamsList, "BottomNavigationBar">>();

  // Getting the handleSaveStudent used to save the avatar photo to the new student and save it to the firebase
  const { handleSaveStudent } = route.params;

  const handleSubmit = async () => {
    try {
      if (handleSaveStudent && typeof handleSaveStudent === "function") {
        // Call the function passed via navigation
        await handleSaveStudent(avatarURI);

        // Navigate after saving
        navigation.navigate("BottomNavigationBar");
      } else {
        console.error("handleSaveStudent is not a function");
      }
    } catch (error) {
      console.error("Error saving profile photo:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label_almost_done}>Almost Done!</Text>
      <Text style={styles.label_choose_avatar}>Choose Avatar:</Text>
      <AvatarComponent onAvatarSelected={(uri: string) => setAvatarURI(uri)} />
      <View style={styles.submit_button_container}>
        <CustomButton
          onPress={() => {
            handleSubmit();
          }}
          title="SUBMIT"
          textColor="black"
          buttonColor="#EC4E4B"
          fontFamily="Quittance"
          textSize={20}
          addFlex={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
  },
  label_almost_done: {
    fontFamily: "Quittance",
    fontSize: 30,
    marginStart: 20,
  },
  label_choose_avatar: {
    marginTop: 2,
    marginStart: 20,
    fontSize: 23,
    fontFamily: "Rany-Bold",
  },
  submit_button_container: {
    marginHorizontal: 20,
    marginBottom: 30,
    height: 65,
  },
});

export default RegisterProfilePhotoScreen;

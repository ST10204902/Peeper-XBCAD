import { Alert, Text, View } from "react-native";
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

type RegisterProfilePhotoScreenRouteProp = RouteProp<
  RootStackParamsList,
  "RegisterProfilePhotoScreen"
>;

function RegisterProfilePhotoScreen() {
  const [avatarURI, setAvatarURI] = useState("");

  // Getting student from navigation
  const route = useRoute<RegisterProfilePhotoScreenRouteProp>();
  const navigation =
    useNavigation<NavigationProp<RootStackParamsList, "BottomNavigationBar">>();

  // Access newStudent from the navigation route params
  const newStudent = route.params;

  const handleSubmit = async () => {
    // Save profile photo logic here
    try {
      await newStudent.save();
      Alert.alert(newStudent.email);
      // Navigate to BottomNavigationBar after success
      navigation.navigate("BottomNavigationBar");
    } catch (error) {
      console.error(`Error saving new student: `, error);
    }
  };

  return (
    <View>
      <Text>Almost Done!</Text>
      <Text>Choose Avatar:</Text>
      <AvatarComponent onAvatarSelected={(uri: string) => setAvatarURI(uri)} />
      <CustomButton
        onPress={handleSubmit}
        title="SUBMIT"
        textColor="black"
        buttonColor="#EC4E4B"
        fontFamily="Quittance"
        textSize={20}
      />
    </View>
  );
}

export default RegisterProfilePhotoScreen;

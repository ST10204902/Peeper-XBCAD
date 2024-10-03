import { Text, View } from "react-native";
import AvatarComponent from "../components/AvatarComponent";
import CustomButton from "../components/LoginRegisterButtonComponent";
import { useState } from "react";

function SubmitButtonEvent() {
  //Do submit button logic here
  console.log("Submit Button Pressed");
}

const RegisterProfilePhotoScreen = () => {
  const [avatarURI, setAvatarURI] = useState("");

  return (
    <View>
      <Text>Almost Done!</Text>
      <Text>Choose Avatar:</Text>
      <AvatarComponent onAvatarSelected={(uri: string) => setAvatarURI(uri)} />
      <CustomButton onPress={SubmitButtonEvent} title="SUBMIT" textColor="black" buttonColor="#EC4E4B" fontFamily="Quittance" textSize={20}/>
    </View>
  );
}

export default RegisterProfilePhotoScreen;

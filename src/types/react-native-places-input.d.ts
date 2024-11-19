declare module "react-native-places-input" {
  import { Component } from "react";
  import { ViewStyle, TextStyle } from "react-native";

  interface PlacesInputProps {
    googleApiKey: string;
    placeHolder?: string;
    language?: string;
    stylesInput?: ViewStyle;
    stylesList?: ViewStyle;
    stylesItem?: TextStyle;
    onSelect: (place: {
      result?: {
        geometry?: {
          location?: {
            lat: number;
            lng: number;
          };
        };
        formatted_address: string;
      };
      geometry?: {
        location?: {
          lat: number;
          lng: number;
        };
      };
    }) => void;
  }

  export default class PlacesInput extends Component<PlacesInputProps> {}
}

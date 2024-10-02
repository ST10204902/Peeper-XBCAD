import { Text } from "react-native";

interface Props {
  orgName: string;
}

export default function ExpandableOrgListItem({ orgName }: Props) {
  return <Text> {orgName} </Text>;
}

//import { Text } from "react-native";
import React from "react";
import ExpandableOrgList from "../../components/ExpandableOrgList";
import { OrgAddress } from "../../models/OrgAddress";
import { Organisation } from "../../models/Organisation";

export default function OrgDetailsScreen() {
  //return <Text> OrgDetailsScreen </Text>;
  const address: OrgAddress = {
    streetAddress: "53 Main Rd",
    suburb: "Claremont",
    city: "Cape Town",
    province: "Western Cape",
    postalCode: "7700",
  };

  const itemList: Organisation[] = [
    {
      org_id: "1",
      orgName: "Massage The Pandas",
      orgAddress: address,
      orgEmail: "MassageThePandas@gmail.com",
      orgPhoneNo: "1999999999",
      orgLatitude: 0,
      orgLongitude: 0,
    },
    {
      org_id: "2",
      orgName: "Homeless People Shouldn't be Homeless",
      orgAddress: address,
      orgEmail: "HomelessPeopleBad@gmail.com",
      orgPhoneNo: "1999999999",
      orgLatitude: 0,
      orgLongitude: 0,
    },
    {
      org_id: "3",
      orgName: "Starving Women Need Makeup (SWNM)",
      orgAddress: address,
      orgEmail: "StarvingWomenNeedMakeup@gmail.com",
      orgPhoneNo: "1999999999",
      orgLatitude: 0,
      orgLongitude: 0,
    },
  ];
  return <ExpandableOrgList items={itemList} />;
}

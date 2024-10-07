import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { commonStyles } from "../../css/common";
import P from "../utilitise/P";

const SubMenu = ({
  showModal,
  name,
  url,
  icon,
  bgColor,
  navigate = true,
  onPress,
}) => {
  const navigation = useNavigation();

  function handler() {
    showModal(false);
    if (navigate) navigation.navigate(url);
    else onPress();
  }

  const iconStyle = {
    ...commonStyles.iconWrapper,
    backgroundColor: bgColor,
  };

  return (
    <Pressable onPress={handler} style={style.container}>
      <View style={iconStyle}>{icon}</View>
      <P color='darkGray' bold style={style.name}>
        {name}
      </P>
    </Pressable>
  );
};

const style = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: -5,
    columnGap: 4,
  },
  name: {
    minWidth: 130,
    borderBottomWidth: 1,
    borderColor: "#b3b3b3",
    paddingBottom: 4,
  },
});

export default SubMenu;

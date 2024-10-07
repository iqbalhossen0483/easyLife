import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { Pressable } from "react-native";

import { styles } from "../../css/footer";
import P from "../utilitise/P";

const Menu = ({ name, Icon, showModal, navigate = "" }) => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <Pressable
      style={styles.iconWrapper}
      onPress={() =>
        navigate ? navigation.navigate(navigate) : showModal((prev) => !prev)
      }
    >
      {Icon}
      <P bold color={navigate === route.name ? "green" : "darkGray"}>
        {name}
      </P>
    </Pressable>
  );
};

export default Menu;

import React from "react";
import { Image, View } from "react-native";

import { styles } from "../../css/profile";
import { serverUrl } from "../../services/common";

const Avater = ({ url }) => {
  return (
    <View>
      {url !== null && url ? (
        <Image style={styles.profile} source={{ uri: serverUrl + url }} />
      ) : (
        <Image
          style={styles.profile}
          source={require("../../assets/no-photo.png")}
        />
      )}
    </View>
  );
};

export default Avater;

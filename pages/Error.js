import React from "react";
import { Image, Text, View } from "react-native";

import { color } from "../components/utilitise/colors";

const Error = () => {
  return (
    <View
      style={{
        backgroundColor: color.gray,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/error.png")}
      />
      <Text
        style={{ textAlign: "center", fontSize: 16, color: "#030303" }}
      >{`There was an error. 
Please check your Internet connection`}</Text>
    </View>
  );
};

export default Error;

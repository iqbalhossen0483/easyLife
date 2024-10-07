import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import useStore from "../../context/useStore";
import { color } from "./colors";

const Splash = () => {
  const { database } = useStore();
  return (
    <View style={styles.container}>
      {database ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={styles.logo}>{database?.title?.charAt(0)}</Text>
          <Text style={styles.title}>{database?.title}</Text>
          <Image
            style={{ width: 60, height: 60 }}
            source={require("../../assets/spiner.gif")}
          />
        </View>
      ) : (
        <Image
          style={{ width: 60, height: 60 }}
          source={require("../../assets/spiner.gif")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    color: "#cdd4d0",
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 10 },
    textShadowRadius: 20,
  },
  logo: {
    fontSize: 100,
    color: "#cdd4d0",
    backgroundColor: "#088235",
    borderRadius: 90,
    height: 130,
    width: 130,
    textAlign: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  container: {
    backgroundColor: color.green,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Splash;

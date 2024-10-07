import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";

import useStore from "../../context/useStore";

const Message = () => {
  const store = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      store?.setMessage(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [store.message.msg]);

  if (!store.message.msg) return null;
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "#00000040",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
      }}
    >
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
          borderRadius: 10,
          width: "70%",
          height: 200,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      >
        {store.message.type === "success" ? (
          <Image
            source={require("../../assets/success.png")}
            style={{
              width: 50,
              height: 50,
              marginBottom: 5,
            }}
          />
        ) : store.message.type === "alert" ? (
          <Image
            resizeMode='contain'
            source={require("../../assets/alert.png")}
            style={{
              width: 50,
              height: 50,
              marginBottom: 5,
            }}
          />
        ) : (
          <Image
            source={require("../../assets/feild.png")}
            style={{
              width: 50,
              height: 50,
              marginBottom: 5,
            }}
          />
        )}
        <Text style={{ fontSize: 16 }}>{store.message.msg}</Text>
      </View>
    </View>
  );
};

export default Message;

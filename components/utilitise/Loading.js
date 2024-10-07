import React from "react";
import { Image, View } from "react-native";

import useStore from "../../context/useStore";

const Loading = () => {
  const store = useStore();

  if (!store.loading) return null;
  return <LoadingUI />;
};

export default Loading;

export function LoadingOnComponent() {
  return <LoadingUI />;
}

function LoadingUI() {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "rgba(0, 210, 0, 0.13)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "70%",
          height: 200,
          shadowColor: "#000",
          backgroundColor: "#09b843",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{ width: 100, height: 100 }}
          source={require("../../assets/spiner.gif")}
        />
      </View>
    </View>
  );
}

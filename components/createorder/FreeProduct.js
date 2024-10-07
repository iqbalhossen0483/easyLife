import Checkbox from "expo-checkbox";
import React from "react";
import { View } from "react-native";

import P from "../utilitise/P";

const FreeProduct = ({ product, setProduct }) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          columnGap: 4,
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Checkbox
          style={{ width: 18, height: 18 }}
          value={product.isFree === "true" ? true : false}
          color={product.isFree === "true" ? "green" : "gray"}
          onValueChange={() =>
            setProduct((prev) => {
              prev.isFree = prev.isFree === "true" ? "false" : "true";
              return { ...prev };
            })
          }
        />
        <P>Free Product?</P>
      </View>
    </>
  );
};

export default FreeProduct;

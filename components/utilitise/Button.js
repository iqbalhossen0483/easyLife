import React from "react";
import { Pressable } from "react-native";

import { color } from "./colors";
import P from "./P";

const Button = ({ title, style, onPress, disabled = false, variant }) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor:
          disabled || variant === "normal" ? color.gray : color.green,
        paddingHorizontal: 9,
        paddingVertical: 7,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
        ...style,
      }}
    >
      <P color='light' bold size={15} align='center'>
        {title}
      </P>
    </Pressable>
  );
};

export default Button;

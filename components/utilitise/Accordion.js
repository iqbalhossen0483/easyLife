import React from "react";
import { LayoutAnimation, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const Accordion = ({
  title,
  body,
  style = {},
  show,
  current,
  setShow,
}) => {
  const toggleOpen = (clicked) => {
    setShow((prev) => {
      if (prev === clicked) return -1;
      else return clicked;
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <View style={style}>
      <TouchableOpacity onPress={() => toggleOpen(current)} activeOpacity={0.6}>
        {title}
      </TouchableOpacity>
      <View style={[styles.list, show !== current ? styles.hidden : undefined]}>
        {body}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    height: 0,
  },
  list: {
    overflow: "hidden",
  },
});

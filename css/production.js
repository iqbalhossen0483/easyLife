import { StyleSheet } from "react-native";

import { color } from "../components/utilitise/colors";

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color.lightGray,
    height: "100%",
  },
  container: {
    backgroundColor: color.light,
    borderBottomWidth: 1,
    borderBottompadding: 12,
    borderBottomColor: color.gray,
    padding: 12,
    paddingVertical: 10,
  },
});

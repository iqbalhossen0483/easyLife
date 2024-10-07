import { StyleSheet } from "react-native";
import { color } from "../components/utilitise/colors";

export const styles = StyleSheet.create({
  profileWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    backgroundColor: color.green,
    paddingVertical: 7,
    paddingHorizontal: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "#edeef5",
    borderBottomWidth: 1,
  },
  notificationNose: {
    width: 8,
    height: 8,
    backgroundColor: "green",
    borderRadius: 50,
    position: "absolute",
    right: 7,
    top: 4,
    zIndex: 1,
  },
});

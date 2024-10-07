import { StyleSheet } from "react-native";

import { color } from "../components/utilitise/colors";

export const styles = StyleSheet.create({
  profile: { width: 60, height: 60, borderRadius: 200 },
  container: {
    marginHorizontal: 10,
    paddingTop: 10,
  },
  profileContainer: {
    backgroundColor: "#fff",
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
    marginBottom: 10,
    zIndex: 60,
  },
  profileWrapper: {
    flexDirection: "row",
    columnGap: 10,
  },
  workContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 10,
    padding: 15,
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 10,
  },
  noteItem: {
    borderBottomColor: color.darkGray,
    borderBottomWidth: 0.3,
    paddingBottom: 5,
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 3,
  },
  orderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: color.gray,
    backgroundColor: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
});

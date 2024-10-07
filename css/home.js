import { StyleSheet } from "react-native";

import { color } from "../components/utilitise/colors";

export const style = StyleSheet.create({
  totalReportContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
    padding: "2%",
    paddingTop: 0,
    borderRadius: 10,
    justifyContent: "space-between",
    rowGap: 10,
  },
  totalReportItem: {
    width: "45%",
    paddingVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  accountContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    padding: 20,
    paddingTop: 0,
    zIndex: 0,
  },
  accountItem: {
    flexDirection: "row",
    columnGap: 5,
    marginVertical: 2,
    borderBottomColor: color.gray,
    borderBottomWidth: 0.5,
    paddingBottom: 3,
    zIndex: 1,
  },
});

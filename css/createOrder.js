import { StyleSheet } from "react-native";

import { color } from "../components/utilitise/colors";

export const styles = StyleSheet.create({
  productContainer: {
    position: "absolute",
    top: 80,
    left: 100,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    gap: 6,
  },
  productTableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: color.gray,
    borderBottomWidth: 0.5,
    paddingBottom: 4,
    marginTop: 7,
  },
  productTableItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: color.gray,
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    overflow: "visible",
    paddingTop: 6,
  },
  deleteBtn: {
    position: "absolute",
    top: 0,
    left: 0,
    marginLeft: "40%",
    backgroundColor: color.orange,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 5,
    borderRadius: 4,
  },
  deleteBtnText: {
    textAlign: "center",
    color: "#fff",
  },
});

import { StyleSheet } from "react-native";

import { color } from "../components/utilitise/colors";

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 20,
    position: "relative",
  },
  headerWrapper: {
    backgroundColor: color.green,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    paddingVertical: 7,
  },
  dateNbill: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shopNameNaddress: {
    borderBottomWidth: 0.7,
    borderBottomColor: "#cbd5e1",
  },
  detailsWrapper: {
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  productTableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.7,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 4,
    marginBottom: 4,
  },
  shopwrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collectionContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});

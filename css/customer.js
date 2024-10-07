import { StyleSheet } from "react-native";

import { color } from "../components/utilitise/colors";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderBottomColor: color.gray,
    borderBottomWidth: 1,
    width: "100%",
  },
  profile: {
    height: 50,
    width: 50,
    borderRadius: 200,
    objectFit: "contain",
  },
  amountWrapper: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
  },
  amount: { textAlign: "center", color: "#fff", marginTop: 5, fontSize: 13 },
  detailsContentContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  customerProfile: {
    alignItems: "center",
    borderBottomColor: color.gray,
    borderBottomWidth: 0.6,
    paddingBottom: 9,
  },
  nameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 5,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    borderBottomColor: color.gray,
    borderBottomWidth: 0.6,
    paddingBottom: 13,
    gap: 10,
  },
  itemSeperator: {
    borderBottomColor: color.gray,
    borderBottomWidth: 0.9,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: color.gray,
  },
  sign: {
    height: 8,
    width: 8,
    borderRadius: 50,
    marginRight: -5,
  },
});

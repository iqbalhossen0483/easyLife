import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  constainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    marginTop: 10,
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 6,
    width: "100%",
  },
  detailsTableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    paddingBottom: 3,
    marginBottom: 3,
  },
  detailsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  bottomContainer: {
    marginTop: 4,
    alignItems: "flex-end",
  },
  bottomItem: {
    borderTopColor: "#cbd5e1",
    borderTopWidth: 1,
    paddingLeft: 10,
    paddingTop: 3,
    width: 100,
    marginTop: 5,
  },
  totalWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalText: {
    marginRight: 4,
  },
  deleteBtn: {
    position: "absolute",
    top: 15,
    right: 15,
  },
});

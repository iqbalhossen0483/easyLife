import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  addBtn: {
    position: "absolute",
    bottom: "10%",
    right: "5%",
    zIndex: 1,
  },
  contentContainer: {
    backgroundColor: "#fff",
    marginVertical: 7,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#eaf0e9",
    borderRadius: 5,
    paddingHorizontal: 13,
    justifyContent: "space-between",
    shadowColor: "#011",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

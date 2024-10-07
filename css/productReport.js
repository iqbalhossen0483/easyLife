import { StyleSheet } from "react-native";

import { color } from "../components/utilitise/colors";

export const style = StyleSheet.create({
  container: {},
  profileWrapper: {
    backgroundColor: "#fff",
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
    shadowColor: color.darkGray,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
  },
  profile: { width: 60, height: 60, borderRadius: 200 },
  name: {
    fontSize: 17,
    color: color.green,
  },
  reportContainer: {
    backgroundColor: "#fff",
    marginVertical: 20,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
  },
  workText: {
    color: color.darkGray,
  },
  subHeader: {
    fontSize: 13,
    marginTop: 15,
    color: color.green,
  },
  subHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  monthName: {
    color: color.darkGray,
  },
});

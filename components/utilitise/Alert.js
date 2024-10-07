import { Alert } from "react-native";

export function alert(msg, callbackFn) {
  Alert.alert(
    "",
    msg,
    [
      {
        text: "Cancel",
        onPress: () => false,
        style: "cancel",
      },
      { text: "OK", onPress: () => callbackFn() },
    ],
    { cancelable: false }
  );
}

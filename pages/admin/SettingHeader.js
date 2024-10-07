import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View } from "react-native";

import { Common } from "../../components/Common";
import Button from "../../components/utilitise/Button";
import P from "../../components/utilitise/P";

const SettingHeader = ({ children }) => {
  const navigation = useNavigation();
  const url = useRoute();

  return (
    <Common>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          paddingVertical: 5,
          gap: 5,
        }}
      >
        <Button
          style={{
            backgroundColor: `${url.name === "info" ? "#16a34a" : "#fff"}`,
          }}
          onPress={() => navigation.navigate("info")}
          title={
            <View>
              <P
                size={15}
                style={{
                  color: url.name === "info" ? "#fff" : "#333",
                }}
              >
                <Feather name='edit' size={18} /> Info
              </P>
            </View>
          }
        />

        <Button
          style={{
            backgroundColor: `${
              url.name === "expenseType" ? "#16a34a" : "#fff"
            }`,
          }}
          onPress={() => navigation.navigate("expenseType")}
          title={
            <View>
              <P
                size={15}
                style={{ color: url.name === "expenseType" ? "#fff" : "#333" }}
              >
                <AntDesign name='pay-circle-o1' size={18} /> Exp type
              </P>
            </View>
          }
        />
      </View>

      {children}
    </Common>
  );
};

export default SettingHeader;

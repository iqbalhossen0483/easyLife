import React, { useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";

import Button from "../../components/utilitise/Button";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { Fetch } from "../../services/common";
import SettingHeader from "./SettingHeader";

const BranchInfo = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const store = useStore();
  const database = store.database;

  async function onSubmit() {
    try {
      setLoading(true);
      Keyboard.dismiss();
      const result = await Fetch(
        store.database.name,
        `/admin/updateinfo?id=${database.id}`,
        "PUT",
        data
      );
      store.setMessage({ msg: result.message, type: "success" });
      store.setUpdateUser((prev) => !prev);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingHeader>
      <View style={commonStyles.formContainer}>
        <View style={{ rowGap: 10 }}>
          <Text>Organisation Name:</Text>
          <TextInput
            onChangeText={(value) =>
              setData((prev) => {
                return { ...prev, title: value };
              })
            }
            style={commonStyles.input}
            placeholder='Name'
            defaultValue={database.title || ""}
          />
          <Text>Organisation Owner:</Text>
          <TextInput
            onChangeText={(value) =>
              setData((prev) => {
                return { ...prev, owner_name: value };
              })
            }
            style={commonStyles.input}
            placeholder='Owner Name'
            defaultValue={database.owner_name || ""}
          />
          <Text>Organisation Address:</Text>
          <TextInput
            onChangeText={(value) =>
              setData((prev) => {
                return { ...prev, address: value };
              })
            }
            style={commonStyles.input}
            placeholder='Address'
            defaultValue={database.address || ""}
          />
          <Text>Phone Number:</Text>
          <TextInput
            onChangeText={(value) =>
              setData((prev) => {
                return { ...prev, phone: value };
              })
            }
            style={commonStyles.input}
            placeholder='Number'
            defaultValue={database.phone || ""}
          />
          <Text>Another Number:</Text>
          <TextInput
            onChangeText={(value) =>
              setData((prev) => {
                return { ...prev, alt_phone: value };
              })
            }
            style={commonStyles.input}
            placeholder='another number'
            defaultValue={database.alt_phone || ""}
          />

          <Text>
            1. You can add {database.max_user} users. Your primary user is{" "}
            {database.primary_user_name}.
          </Text>
          <Text>2. You can add {database.max_product} products.</Text>
          <Text>3. You can add {database.max_customer} customers.</Text>
          {database.production ? (
            <Text>4. This Organisation is a manufacturer.</Text>
          ) : null}
          <Button
            title={loading ? "Saving..." : "Save"}
            disabled={loading}
            onPress={onSubmit}
          />
        </View>
      </View>
    </SettingHeader>
  );
};

export default BranchInfo;

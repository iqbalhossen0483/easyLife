import { Image, Keyboard, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";

import FileInput from "../../components/utilitise/FileInput";
import { Fetch, serverUrl } from "../../services/common";
import Button from "../../components/utilitise/Button";
import { Common } from "../../components/Common";
import { commonStyles } from "../../css/common";
import useStore from "../../context/useStore";
import P from "../../components/utilitise/P";

const AddSupplyer = ({ route, navigation }) => {
  const [profile, setProfile] = useState(null);
  const { setMessage, setLoading, setUpdateSupplier, loading, database } =
    useStore();
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });

  function handleChange(name, value) {
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  }

  useEffect(() => {
    if (route.params?.edit) {
      setForm(route.params.data);
      setProfile({ uri: serverUrl + route.params.data.profile, edit: true });
    }
  }, [route.params]);

  async function onSubmit() {
    setLoading(true);
    Keyboard.dismiss();
    if (!profile?.edit) {
      if (route.params?.edit) form.existedImg = form.profile;
      form.profile = profile;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );
      const method = route.params?.edit ? "PUT" : "POST";
      const { message } = await Fetch(
        database.name,
        "/supplier",
        method,
        formData,
        true
      );
      setMessage({ msg: message, type: "success" });
      setUpdateSupplier((prev) => !prev);
      navigation.goBack();
    } catch (error) {
      setMessage({ msg: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const disabled = !form.name || !form.address;
  return (
    <Common>
      <View style={commonStyles.formContainer}>
        <P bold style={commonStyles.formHeader}>
          {route.params?.edit ? "Edit" : "Add"} Supplyer
        </P>

        <View style={{ rowGap: 9 }}>
          <TextInput
            defaultValue={form.name}
            onChangeText={(value) => handleChange("name", value)}
            style={commonStyles.input}
            placeholder='Supplier name'
          />
          <TextInput
            defaultValue={form.address}
            onChangeText={(value) => handleChange("address", value)}
            style={commonStyles.input}
            placeholder='Address'
          />
          <TextInput
            defaultValue={form.phone?.toString()}
            onChangeText={(value) => handleChange("phone", value)}
            style={commonStyles.input}
            placeholder='Phone number'
            keyboardType='phone-pad'
          />

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View>
              <FileInput setImage={setProfile} aspect={false} />
            </View>
            {profile && (
              <Image
                source={{ uri: profile.uri }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                  resizeMode: "center",
                }}
              />
            )}
          </View>
          <Button
            disabled={loading || disabled}
            onPress={onSubmit}
            title='Submit'
          />
        </View>
      </View>
    </Common>
  );
};

export default AddSupplyer;

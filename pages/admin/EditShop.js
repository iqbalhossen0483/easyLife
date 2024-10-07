import React, { useEffect, useState } from "react";
import { Image, Keyboard, ScrollView, TextInput, View } from "react-native";

import { Common } from "../../components/Common";
import Button from "../../components/utilitise/Button";
import FileInput from "../../components/utilitise/FileInput";
import P from "../../components/utilitise/P";
import Select from "../../components/utilitise/Select";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { Fetch, notify, serverUrl } from "../../services/common";

const EditShop = ({ route, navigation }) => {
  const [profile, setProfile] = useState(null);
  const [margin, setMargin] = useState(0);
  const [form, setForm] = useState(route.params?.data);
  const store = useStore();

  function handleChange(name, value) {
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  }

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (event) => {
      setMargin(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setMargin(0);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  async function onSubmit() {
    try {
      store.setLoading(true);

      if (profile) {
        form.existedImg = form.profile;
        form.profile = profile;
      }
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("added_by", store.user.id);
      const { message } = await Fetch(
        store.database.name,
        `/customer?id=${form.id}`,
        "PUT",
        formData,
        true
      );
      if (message) store.setMessage({ msg: message, type: "success" });
      store.setUpdateCustomer((prev) => !prev);
      navigation.goBack();
      await notify(
        store.database.name,
        "A Shop Edited",
        `A shop edited by ${store.user.name}`,
        { type: "shop_added", id: store.user.id }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  const disabled =
    !form.owner ||
    !form.address ||
    !form.shopName ||
    !form.phone ||
    !form.machine_model ||
    !form.machine_type;

  return (
    <Common>
      <ScrollView style={{ marginBottom: margin }}>
        <View style={commonStyles.formContainer}>
          <P bold style={commonStyles.formHeader}>
            Edit Shop
          </P>
          <View style={{ rowGap: 9 }}>
            <TextInput
              defaultValue={form.owner}
              onChangeText={(value) => handleChange("owner", value)}
              style={commonStyles.input}
              placeholder='Shop owner name'
            />
            <TextInput
              defaultValue={form.shopName}
              onChangeText={(value) => handleChange("shopName", value)}
              style={commonStyles.input}
              placeholder='Shop name'
            />
            <TextInput
              defaultValue={form.address}
              onChangeText={(value) => handleChange("address", value)}
              style={commonStyles.input}
              placeholder='Address'
              multiline
            />
            <TextInput
              defaultValue={form.phone?.toString()}
              onChangeText={(value) => handleChange("phone", value)}
              style={commonStyles.input}
              placeholder='Phone number'
              keyboardType='phone-pad'
              maxLength={11}
            />
            <TextInput
              defaultValue={form.machine_model}
              onChangeText={(value) => handleChange("machine_model", value)}
              style={commonStyles.input}
              placeholder='Machine Model'
            />
            <Select
              name='machine_type'
              defaultValue={form.machine_type}
              placeholder='Machine Type'
              header='type'
              height='auto'
              options={[
                { id: 1, type: "switchCafe" },
                { id: 2, type: "others" },
              ]}
              handler={(_, info) => handleChange("machine_type", info.type)}
            />

            <TextInput
              defaultValue={form.product_info}
              onChangeText={(value) => handleChange("product_info", value)}
              style={commonStyles.input}
              placeholder='Product info'
              multiline
            />
            {store.user.designation === "Admin" ? (
              <TextInput
                defaultValue={form.commission?.toString()}
                onChangeText={(value) => handleChange("commission", value)}
                style={commonStyles.input}
                placeholder='How much commission you want to pay %'
                keyboardType='phone-pad'
              />
            ) : null}
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <View>
                <FileInput setImage={setProfile} />
              </View>
              <Image
                source={{
                  uri: profile ? profile.uri : serverUrl + form.profile,
                }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 100,
                  resizeMode: "center",
                }}
              />
            </View>
            <Button
              disabled={store.loading || disabled}
              onPress={onSubmit}
              title='Submit'
            />
          </View>
        </View>
      </ScrollView>
    </Common>
  );
};

export default EditShop;

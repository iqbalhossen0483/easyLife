import { Image, Keyboard, TextInput, View } from "react-native";
import React, { useReducer, useState } from "react";
import Checkbox from "expo-checkbox";

import FileInput from "../../components/utilitise/FileInput";
import { Fetch, serverUrl } from "../../services/common";
import Button from "../../components/utilitise/Button";
import { Common } from "../../components/Common";
import { commonStyles } from "../../css/common";
import useStore from "../../context/useStore";
import P from "../../components/utilitise/P";

function reducer(state, name) {
  switch (name) {
    case "Main":
      return { main: 1, normal: 0, raw: 0, type: "Main" };
    case "Normal":
      return { main: 0, normal: 1, raw: 0, type: "Normal" };
    case "Raw":
      return { main: 0, normal: 0, raw: 1, type: "Raw" };
    default:
      return state;
  }
}

const EditProduct = ({ route, navigation }) => {
  const [image, setImage] = useState(null);
  const [state, dispatch] = useReducer(reducer, {
    main: route.params.data.main,
    normal: route.params.data.normal,
    raw: route.params.data.raw,
    type: route.params.data.type,
  });
  const { setMessage, setLoading, setUpdateProduct, loading, database } =
    useStore();
  const [form, setForm] = useState(route.params.data);

  function handleChange(name, value) {
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function onSubmit() {
    try {
      setLoading(true);
      Keyboard.dismiss();
      if (image) {
        form.existedImg = form.profile;
        form.profile = image;
      }

      form.main = state.main.toString();
      form.normal = state.normal.toString();
      form.raw = state.raw.toString();
      form.type = state.type;
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      const { message } = await Fetch(
        database.name,
        `/product?id=${form.id}`,
        "PUT",
        formData,
        true
      );
      setMessage({ msg: message, type: "success" });
      setUpdateProduct((prev) => !prev);
      navigation.goBack();
    } catch (error) {
      setMessage({ msg: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const disabled = !form.name || !form.price || !form.shortName;
  return (
    <Common>
      <View style={commonStyles.formContainer}>
        <P bold style={commonStyles.formHeader}>
          {route.params?.edit ? "Edit" : "Add"} Product
        </P>

        <View style={{ rowGap: 9 }}>
          <TextInput
            defaultValue={form.name}
            onChangeText={(value) => handleChange("name", value)}
            style={commonStyles.input}
            placeholder='Product name'
          />
          <TextInput
            defaultValue={form.shortName}
            onChangeText={(value) => handleChange("shortName", value)}
            style={commonStyles.input}
            placeholder='Product short name'
          />
          <TextInput
            defaultValue={form.price.toString()}
            onChangeText={(value) => handleChange("price", value)}
            style={commonStyles.input}
            placeholder='Unit price৳'
            keyboardType='phone-pad'
          />
          <TextInput
            defaultValue={form.stock.toString()}
            onChangeText={(value) => handleChange("stock", value)}
            style={commonStyles.input}
            placeholder='Stock'
            keyboardType='phone-pad'
          />
          <TextInput
            defaultValue={form.sl ? form.sl.toString() : "0"}
            onChangeText={(value) => handleChange("sl", value)}
            style={commonStyles.input}
            placeholder='Serial Number'
            keyboardType='phone-pad'
          />

          {database.production ? (
            <View>
              <List
                state={state.main}
                name='main'
                controller={() => dispatch("Main")}
              >
                Is this Main product?
              </List>
              <List
                state={state.normal}
                name='normal'
                controller={() => dispatch("Normal")}
              >
                Is this Normal product?
              </List>
              <List
                state={state.raw}
                name='raw'
                controller={() => dispatch("Raw")}
              >
                Is this Raw product?
              </List>
            </View>
          ) : null}

          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <View>
              <FileInput setImage={setImage} aspect={false} />
            </View>
            {(image || form.profile) && (
              <Image
                source={{ uri: image ? image.uri : serverUrl + form.profile }}
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

function List({ state, controller, children }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginVertical: 5,
      }}
    >
      <Checkbox
        value={state ? true : false}
        style={{ width: 15, height: 15 }}
        color={state ? "green" : "gray"}
        onValueChange={controller}
      />
      <P size={15}>{children}</P>
    </View>
  );
}

export default EditProduct;

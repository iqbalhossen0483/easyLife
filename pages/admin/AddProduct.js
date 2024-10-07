import { Image, Keyboard, TextInput, View } from "react-native";
import React, { useReducer, useState } from "react";
import Checkbox from "expo-checkbox";

import FileInput from "../../components/utilitise/FileInput";
import Button from "../../components/utilitise/Button";
import { Common } from "../../components/Common";
import { commonStyles } from "../../css/common";
import useStore from "../../context/useStore";
import { Fetch } from "../../services/common";
import P from "../../components/utilitise/P";

const init = {
  main: 1,
  normal: 0,
  raw: 0,
  type: "Main",
};
function reducer(state, name) {
  switch (name) {
    case "Main":
      return init;
    case "Normal":
      return { main: 0, normal: 1, raw: 0, type: "Normal" };
    case "Raw":
      return { main: 0, normal: 0, raw: 1, type: "Raw" };
    default:
      return state;
  }
}
const AddProduct = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [state, dispatch] = useReducer(reducer, init);
  const {
    setMessage,
    setLoading,
    setUpdateProduct,
    loading,
    database,
    setUpdateUser,
  } = useStore();
  const [form, setForm] = useState({
    name: "",
    price: "",
    shortName: "",
    stock: 0,
    sl: 0,
  });

  function handleChange(name, value) {
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function onSubmit() {
    try {
      setLoading(true);
      Keyboard.dismiss();

      if (database.max_product <= database.current_product) {
        alert("Product limit exceeded. Please contact your administrator");
        return;
      }

      if (image) form.profile = image;

      const formData = new FormData();
      Object.entries({ ...form, ...state }).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const { message } = await Fetch(
        database.name,
        "/product",
        "POST",
        formData,
        true
      );
      setMessage({ msg: message, type: "success" });
      setUpdateProduct((prev) => !prev);
      setUpdateUser((prev) => !prev);

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
          Add Product
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
            defaultValue={form.stock}
            onChangeText={(value) => handleChange("stock", value)}
            style={commonStyles.input}
            placeholder='Stock'
            keyboardType='phone-pad'
          />
          <TextInput
            defaultValue={form.sl}
            onChangeText={(value) => handleChange("sl", value)}
            style={commonStyles.input}
            placeholder='SL / Serial Number'
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
            {image && (
              <Image
                source={{ uri: image.uri }}
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

export default AddProduct;

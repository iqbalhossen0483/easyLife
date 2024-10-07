import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";

import Button from "../components/utilitise/Button";
import useStore from "../context/useStore";
import { commonStyles } from "../css/common";
import { Fetch, role } from "../services/common";

const Login = ({ navigation }) => {
  const [showPass, setShowPass] = useState(false);
  const store = useStore();
  const [form, setForm] = useState({
    db: null,
    phone: "",
    password: "",
  });

  function handleChange(name, value) {
    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  }

  async function onSubmit() {
    try {
      store.setLoading(true);
      Keyboard.dismiss();
      const data = { password: form.password };
      data.db = form.phone.split("-")[0];
      data.phone = form.phone.split("-")[1];
      const {
        token,
        data: { user, database },
      } = await Fetch("login", "/login", "POST", data);
      store.setLoading(false);

      await AsyncStorage.setItem("token", token);
      store.setDatabase(database);
      store.setUser(user);
      store.setShowSplash(true);
      const designation = user.designation;
      const url =
        designation === role.admin
          ? "home"
          : designation === role.store_manager
          ? "stock"
          : designation === role.controller
          ? "dashboard"
          : "profile";
      navigation.navigate(url);
    } catch (error) {
      store.setLoading(false);
      store.setMessage({ msg: error.message, type: "error" });
    }
  }

  return (
    <View style={{ ...commonStyles.formContainer, marginTop: 100 }}>
      <Text style={commonStyles.formHeader}>Login</Text>

      <View style={{ rowGap: 12 }}>
        <TextInput
          onChangeText={(value) => handleChange("phone", value)}
          style={commonStyles.input}
          placeholder="Access key '-' Phone number"
          keyboardType='phone-pad'
        />
        <View>
          <TextInput
            onChangeText={(value) => handleChange("password", value)}
            style={commonStyles.input}
            placeholder='Password'
            secureTextEntry={!showPass}
            textContentType={"password"}
          />
          <Pressable
            onPress={() => setShowPass((prev) => !prev)}
            style={{ position: "absolute", top: 10, right: 10 }}
          >
            <Feather
              name={showPass ? "eye" : "eye-off"}
              size={20}
              color='green'
            />
          </Pressable>
        </View>

        <Button
          disabled={!form.phone || !form.password || store.loading}
          onPress={onSubmit}
          title='Submit'
        />
      </View>
    </View>
  );
};

export default Login;

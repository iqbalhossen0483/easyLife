import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  Pressable,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { Fetch } from "../../services/common";
import { color } from "./colors";
import P from "./P";

const Select = ({
  placeholder,
  name,
  editable = true,
  url,
  handler,
  options = null,
  header,
  title,
  defaultValue,
  top = false,
  zIndex = 100,
  search = false,
  height = 170,
}) => {
  const [show, setShow] = useState(false);
  const [headerValue, setHeaderValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(options);
  const [value, setValue] = useState("");
  const store = useStore();

  useEffect(() => {
    async function fethData() {
      try {
        setLoading(true);
        if (search) url += `&search=${value}`;
        const result = await Fetch(store.database.name, url, "GET");
        setData(result);
      } catch (error) {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    if (url && !search) fethData();
    else if (search && value) fethData();
    else if (options && editable && value) {
      const filtered = options.filter((item) =>
        item[header].toLowerCase().includes(value.toLowerCase())
      );
      setData(filtered);
    } else if (!value && editable) {
      setData(options);
    }
  }, [value]);

  useEffect(() => {
    if (value.length >= 3 && value !== headerValue) setShow(true);
    else setShow(false);
  }, [value]);

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
      setHeaderValue(defaultValue);
      setShow(false);
    }
  }, [defaultValue]);

  function handleTuch(info) {
    Keyboard.dismiss();
    setValue(info[header]);
    setHeaderValue(info[header]);
    handler(name, info);
  }

  return (
    <View style={{ zIndex }}>
      <TextInput
        value={value}
        onChangeText={(value) => setValue(value)}
        placeholder={placeholder}
        defaultValue={defaultValue || ""}
        style={commonStyles.input}
        editable={editable}
      />
      <Pressable
        onPress={() => setShow((prev) => !prev)}
        style={{ position: "absolute", top: 8, right: 5 }}
      >
        {!search ? (
          <MaterialIcons
            name={show ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color={color.darkGray}
          />
        ) : null}
      </Pressable>

      {show && (
        <ScrollView
          style={{
            ...commonStyles.selectView,
            top: top ? "-350%" : "100%",
            height,
          }}
        >
          {loading ? (
            <P align='center'>Loading...</P>
          ) : data && data.length ? (
            data.map((item, i, arr) => (
              <TouchableHighlight
                onPress={() => handleTuch(item)}
                key={i}
                activeOpacity={0.5}
                underlayColor={color.gray}
              >
                <View
                  style={{
                    borderBottomWidth: arr.length - 1 !== i ? 0.5 : 0,
                    borderBottomColor: color.gray,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                  }}
                >
                  <P size={15}>{item[header]}</P>
                  {title ? (
                    <P color='darkGray' style={{ marginTop: -3 }}>
                      {item[title]}
                    </P>
                  ) : null}
                </View>
              </TouchableHighlight>
            ))
          ) : (
            <P align='center'>no options</P>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default Select;

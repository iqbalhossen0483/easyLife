import { Keyboard, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";

import Button from "../components/utilitise/Button";
import { Common } from "../components/Common";
import { commonStyles } from "../css/common";
import useStore from "../context/useStore";
import { Fetch } from "../services/common";
import P from "../components/utilitise/P";

const CreateNote = ({ route, navigation }) => {
  const store = useStore();
  const [notes, setNotes] = useState({
    heading: "",
    description: "",
  });

  async function onSubmit() {
    try {
      store.setLoading(true);
      Keyboard.dismiss();
      notes.userId = store.user.id;
      const method = route.params?.edit ? "PUT" : "POST";
      const url = route.params?.edit ? `/notes?id=${notes.id}` : "/notes";
      const { message } = await Fetch(store.database.name, url, method, notes);
      store.setMessage({ msg: message, type: "success" });
      store.setUpdateNotes((prev) => !prev);
      navigation.goBack();
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  useEffect(() => {
    if (route.params?.edit) {
      setNotes(route.params.data);
    }
  }, [route.params]);
  const disabled = !notes.heading || !notes.description;
  return (
    <Common>
      <View style={commonStyles.formContainer}>
        <P bold style={commonStyles.formHeader}>
          {route.params?.edit ? "Edit" : "Create"} Note
        </P>
        <View style={{ rowGap: 8 }}>
          <TextInput
            onChangeText={(value) =>
              setNotes((prev) => {
                return { ...prev, heading: value };
              })
            }
            style={commonStyles.input}
            placeholder='Heading'
            defaultValue={notes.heading}
          />
          <TextInput
            multiline
            numberOfLines={10}
            style={{
              textAlignVertical: "top",
              ...commonStyles.input,
              paddingTop: 5,
              height: 150,
            }}
            onChangeText={(value) =>
              setNotes((prev) => {
                return { ...prev, description: value };
              })
            }
            placeholder='Description'
            defaultValue={notes.description}
          />
        </View>
        <Button
          style={{ marginTop: 10 }}
          onPress={onSubmit}
          disabled={store.loading || disabled}
          title='Save'
        />
      </View>
    </Common>
  );
};

export default CreateNote;

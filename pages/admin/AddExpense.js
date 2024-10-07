import React, { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";

import { Common } from "../../components/Common";
import Button from "../../components/utilitise/Button";
import P from "../../components/utilitise/P";
import Select from "../../components/utilitise/Select";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { Fetch, notify } from "../../services/common";

const AddExpense = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    type: "",
    amount: 0,
  });
  const store = useStore();

  async function onSubmit() {
    try {
      setLoading(true);
      Keyboard.dismiss();
      data.amount = parseInt(data.amount);
      data.created_by = store.user.id;
      data.userDesignation = store.user.designation;
      const { message } = await Fetch(
        store.database.name,
        "/expense",
        "POST",
        data
      );
      store.setMessage({ msg: message, type: "success" });
      navigation.goBack();
      store.setUpdateUser((prev) => !prev);
      if (store.user.designation === "Admin") {
        store.setUpdateReport((prev) => !prev);
        store.setUpdateExpense((prev) => !prev);
      } else {
        await notify(
          store.database.name,
          "Expense Request Sent",
          `An expense request sent by ${store.user.name}`,
          { type: "expense_req_sent", id: store.user.id, admin: true }
        );
      }
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }
  const disabled = !data.type || !data.amount;
  return (
    <Common>
      <View style={commonStyles.formContainer}>
        <P bold style={commonStyles.formHeader}>
          Add Expense
        </P>

        <View style={{ rowGap: 10 }}>
          <Select
            name='expense_type'
            placeholder='Expense Type'
            url='/expense/type'
            header='title'
            handler={(_, info) => {
              setData((prev) => {
                return { amount: prev.amount, type: info.title };
              });
            }}
          />
          <TextInput
            onChangeText={(value) =>
              setData((prev) => {
                return { amount: value, type: prev.type };
              })
            }
            keyboardType='phone-pad'
            style={commonStyles.input}
            placeholder='Amount $'
          />
          <Button
            title={loading ? "Saving..." : "Save"}
            disabled={loading || disabled}
            onPress={onSubmit}
          />
        </View>
      </View>
    </Common>
  );
};

export default AddExpense;

import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";

import { Common } from "../components/Common";
import BDT from "../components/utilitise/BDT";
import Button from "../components/utilitise/Button";
import P from "../components/utilitise/P";
import Select from "../components/utilitise/Select";
import useStore from "../context/useStore";
import { commonStyles } from "../css/common";
import { Fetch, notify } from "../services/common";

const BalanceTransfer = ({ route, navigation }) => {
  const user = route.params.user;
  const [users, setUsers] = useState(null);
  const [form, setForm] = useState({
    purpose: "",
    amount: 0,
    restAmount: 0,
    to: {},
  });
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const users = await Fetch(
          store.database.name,
          "/user?type=true",
          "GET"
        );
        const rest = users.filter((item) => item.id !== user.id);
        setUsers(rest);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    })();
  }, []);

  async function onSubmit() {
    try {
      store.setLoading(true);
      form.fromUser = user.id;
      form.toUser = form.to.userId;
      form.user_type = form.to.type;
      const body = { ...form };
      delete body.to;
      delete body.restAmount;
      const res = await Fetch(
        store.database.name,
        "/user/balance_transfer",
        "POST",
        body
      );
      store.setMessage({ msg: res.message, type: "success" });

      store.setUpdateUser((prev) => !prev);
      navigation.goBack();

      await notify(
        store.database.name,
        "Transfer Request",
        `You have a balance transfer request from ${form.to.name}`,
        { type: "balance_transfer_request", toUser: form.to.userId }
      );
    } catch (error) {
      setForm((prev) => {
        return { ...prev, restAmount: user.haveMoney };
      });
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  if (store.loading) return null;
  const options = [
    { id: 1, name: "Balance Transfer" },
    { id: 2, name: "Debt Payment" },
  ];
  if (store.user.designation === "Admin") {
    options.push(
      { id: 3, name: "Salary" },
      { id: 4, name: "Incentive" },
      { id: 5, name: "Debt" }
    );
  }

  const disabled = !form.amount || !form.to.userId || !form.purpose;
  return (
    <Common>
      <View style={commonStyles.formContainer}>
        <P bold style={commonStyles.formHeader}>
          Balance Transfer
        </P>
        {form.purpose && form.purpose !== "Debt Payment" ? (
          <P style={{ marginBottom: 5 }}>
            {form.purpose}:<BDT amount={form.restAmount || user.haveMoney} />
          </P>
        ) : null}
        <View style={{ rowGap: 9 }}>
          <Select
            name='purpose'
            placeholder='Purpose'
            header='name'
            zIndex={150}
            editable={false}
            height={150}
            handler={(_, info) =>
              setForm((prev) => {
                return { ...prev, purpose: info.name };
              })
            }
            options={options}
          />
          <TextInput
            defaultValue={form.amount.toString()}
            onChangeText={(value) => {
              setForm((prev) => {
                return {
                  ...prev,
                  amount: parseInt(value || 0),
                  restAmount: user.haveMoney - parseInt(value || 0),
                };
              });
            }}
            style={commonStyles.input}
            placeholder='Amount ৳'
            keyboardType='numeric'
          />

          <Select
            name='to'
            placeholder='To'
            header='name'
            handler={(_, info) =>
              setForm((prev) => {
                return {
                  ...prev,
                  to: {
                    userId: info.id,
                    name: info.name,
                    type: info.type,
                  },
                };
              })
            }
            options={users}
          />

          <TextInput
            style={{
              textAlignVertical: "top",
              ...commonStyles.input,
              paddingTop: 5,
              height: 100,
            }}
            placeholder='Some notes'
            multiline
            onChangeText={(value) =>
              setForm((prev) => {
                return {
                  ...prev,
                  notes: value,
                };
              })
            }
          />

          <Button
            disabled={store.loading || disabled}
            onPress={onSubmit}
            title='Submit'
          />
        </View>
      </View>
    </Common>
  );
};

export default BalanceTransfer;

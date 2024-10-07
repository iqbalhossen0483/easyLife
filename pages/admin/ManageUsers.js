import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { Common } from "../../components/Common";
import Drawar from "../../components/Drawar";
import SubMenu from "../../components/footer/SubMenu";
import { alert as Alert } from "../../components/utilitise/Alert";
import Avater from "../../components/utilitise/Avater";
import Button from "../../components/utilitise/Button";
import { color } from "../../components/utilitise/colors";
import P from "../../components/utilitise/P";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/manageProduct";
import { Fetch, notify, openNumber, role } from "../../services/common";

const ManageUsers = ({ navigation }) => {
  const [targetForm, setTargetForm] = useState(null);
  const [showForm, setShowFrom] = useState(null);
  const [users, setUsers] = useState(null);

  const store = useStore();
  const [data, setData] = useState({
    targetedAmnt: 0,
    end_date: new Date(),
    start_date: new Date(),
    commission: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const users = await Fetch(store.database.name, "/user", "GET");
        const rest = users.filter((item) => item.id !== store.user.id);
        setUsers(rest);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    })();
    return () => store.setLoading(false);
  }, [store.updateUser]);

  function removeUser(id, profile) {
    Alert("Are you sure to remove?", async () => {
      try {
        store.setLoading(true);

        if (store.database.primary_user === id) {
          alert("This is the primary user. You cannot remove it.");
          return;
        }

        const { message } = await Fetch(
          store.database.name,
          `/user?id=${id}&profile=${profile}`,
          "DELETE"
        );
        store.setMessage({ msg: message, type: "success" });
        store.setUpdateUser((prev) => !prev);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    });
  }

  const showDatepicker = (col) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, selectedDate) => {
        setData((prev) => {
          return { ...prev, [col]: selectedDate };
        });
      },
      mode: "date",
      is24Hour: true,
    });
  };

  async function handleTarget() {
    try {
      Keyboard.dismiss();
      store.setLoading(true);
      data.user_id = targetForm.id;
      const selectedDay = data.start_date.getTime();
      const today = new Date().getTime();
      if (selectedDay <= today) {
        data.status = "running";
      } else {
        data.status = "pending";
      }

      const { message } = await Fetch(
        store.database.name,
        `/user/target`,
        "POST",
        data
      );
      setTargetForm(null);
      store.setMessage({ msg: message, type: "success" });

      await notify(
        store.database.name,
        "Target Received",
        `Dear ${store.user.name} your target received by ${store.user.name}`,
        { type: "target_received", toUser: data.user_id }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  const isExistTarget = targetForm?.targets?.find(
    (tc) => tc.status === "pending" || tc.status === "running"
  );

  return (
    <Common>
      {store.user.designation === role.admin ? (
        <View style={styles.addBtn}>
          <Button
            onPress={() => navigation.navigate("addUser")}
            style={{ width: 40, height: 40, borderRadius: 100 }}
            title={<AntDesign name='pluscircle' size={22} color='#fff' />}
          />
        </View>
      ) : null}

      <FlatList
        style={{ marginBottom: 57 }}
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ marginBottom: 6 }} />}
        ListEmptyComponent={() => <P align='center'>No user</P>}
        ListHeaderComponent={() => (
          <Button
            onPress={() => navigation.navigate("commission")}
            style={{ marginBottom: 15 }}
            title='Manage Cmmission'
          />
        )}
        renderItem={({ item: user }) => {
          const targets = {
            pending: 0,
            running: 0,
            achieved: 0,
            failed: 0,
          };
          user.targets?.forEach((tc) => {
            if (tc.status === "pending") targets.pending++;
            else if (tc.status === "running") targets.running++;
            else if (tc.status === "achieved") targets.achieved++;
            else if (tc.status === "failed") targets.failed++;
          });
          return (
            <Pressable
              style={styles.itemContainer}
              onPress={() => setShowFrom(user)}
            >
              <View style={{ flexDirection: "row", gap: 7 }}>
                <Avater url={user.profile} />

                <View>
                  <P size={15} bold>
                    {user.name}
                  </P>
                  <P color='darkGray' size={13}>
                    {user.designation}
                  </P>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      openNumber(user.phone);
                    }}
                  >
                    <P color='green' size={13}>
                      {user.phone}
                    </P>
                  </Pressable>
                </View>
              </View>
              {store.user.designation === role.admin ? (
                <View>
                  <P align='center' bold>
                    Targets Report
                  </P>
                  <P style={{ color: "#946f09" }}>Pending: {targets.pending}</P>
                  <P style={{ color: "#75850c" }}>Running: {targets.running}</P>
                  <P style={{ color: "#038a0a" }}>
                    Achieved: {targets.achieved}
                  </P>
                  <P style={{ color: "#946f09" }}>Failed: {targets.failed}</P>
                </View>
              ) : null}
            </Pressable>
          );
        }}
      />
      <Drawar
        setShowModal={() => setShowFrom(null)}
        show={showForm ? true : false}
      >
        {store.user.designation === role.admin ? (
          <>
            <SubMenu
              name='Edit'
              navigate={false}
              onPress={() =>
                navigation.navigate("addUser", { edit: true, data: showForm })
              }
              bgColor='#f7d5f6'
              showModal={setShowFrom}
              icon={<Feather name='edit' size={16} color='#d638d2' />}
            />
            <SubMenu
              name='Remove'
              bgColor={color.lightOrange}
              navigate={false}
              showModal={setShowFrom}
              onPress={() => removeUser(showForm.id, showForm.profile)}
              icon={
                <MaterialCommunityIcons
                  name='archive-remove'
                  size={18}
                  color={color.orange}
                />
              }
            />

            <SubMenu
              name='Give Target'
              navigate={false}
              onPress={() => setTargetForm(showForm)}
              bgColor='#d3b0e8'
              showModal={setShowFrom}
              icon={
                <MaterialCommunityIcons
                  name='target-account'
                  size={24}
                  color='#970ced'
                />
              }
            />
          </>
        ) : null}
        <SubMenu
          name='Report'
          navigate={false}
          onPress={() =>
            navigation.navigate("profile", {
              userId: showForm.id,
              edit: false,
            })
          }
          bgColor='#d7e5f5'
          showModal={setShowFrom}
          icon={<Octicons name='report' size={16} color='#3b83db' />}
        />
      </Drawar>

      <Drawar
        setShowModal={() => setTargetForm(null)}
        show={targetForm ? true : false}
        coverScreen
      >
        <View style={{ rowGap: 6 }}>
          <Text style={{ ...commonStyles.formHeader, fontSize: 14 }}>
            Give a target to {targetForm?.name}
          </Text>
          {isExistTarget ? (
            <Text style={{ marginTop: -10, color: "#ad6109" }}>
              A target is pending or running
            </Text>
          ) : null}
          <TextInput
            style={commonStyles.input}
            placeholder='Targeted Amount ৳'
            keyboardType='phone-pad'
            onChangeText={(value) =>
              setData((prev) => {
                return {
                  ...prev,
                  targetedAmnt: value,
                };
              })
            }
          />
          <TextInput
            style={commonStyles.input}
            placeholder='Start Date'
            editable={false}
            value={
              data.start_date
                ? data.start_date.toLocaleDateString("en-GB")
                : "Start Date"
            }
          />
          <Pressable onPress={() => showDatepicker("end_date")}>
            <TextInput
              style={commonStyles.input}
              placeholder='End Date'
              editable={false}
              value={
                data.end_date ? data.end_date.toLocaleDateString() : "End Date"
              }
            />
          </Pressable>
          <TextInput
            style={commonStyles.input}
            placeholder='commission %'
            keyboardType='phone-pad'
            onChangeText={(value) =>
              setData((prev) => {
                return {
                  ...prev,
                  commission: value,
                };
              })
            }
          />
          <Button
            disabled={
              !data.targetedAmnt ||
              !data.commission ||
              !data.end_date ||
              !data.start_date ||
              isExistTarget
            }
            onPress={handleTarget}
            title={store.loading ? "Loading..." : "Save Target"}
          />
        </View>
      </Drawar>
    </Common>
  );
};

export default ManageUsers;

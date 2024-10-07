import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";

import { Common } from "../components/Common";
import MoneyReport from "../components/profile/MoneyReport";
import Notes from "../components/profile/Notes";
import RecentActivity from "../components/profile/RecentActivity";
import Summery from "../components/profile/Summery";
import Target from "../components/profile/Target";
import { alert } from "../components/utilitise/Alert";
import Avater from "../components/utilitise/Avater";
import Button from "../components/utilitise/Button";
import P from "../components/utilitise/P";
import Splash from "../components/utilitise/Splash";
import useStore from "../context/useStore";
import { styles } from "../css/profile";
import { Fetch, openNumber, role } from "../services/common";

const Profile = ({ route, navigation }) => {
  const store = useStore();
  const [user, setUser] = useState(null);

  function goForEdit() {
    navigation.navigate("addUser", {
      edit: true,
      data: user,
      user: true,
    });
  }

  useEffect(() => {
    (async () => {
      try {
        const url = `/user?id=${route.params?.userId || store.user.id}`;
        const user = await Fetch(store.database.name, url, "GET");
        setUser(user[0]);
        store.setShowSplash(false);
      } catch (error) {
        navigation.navigate("error");
      }
    })();
  }, [store.updateUser, route.params?.userId]);

  function logOut() {
    alert("Are you sure to log Out?", async () => {
      await AsyncStorage.removeItem("token");
      store.setUser(null);
    });
  }

  if (!user) return <Splash />;

  const money_transactions = user?.money_transactions;

  return (
    <Common>
      <ScrollView style={{ ...styles.container, marginBottom: 57 }}>
        <View style={styles.profileContainer}>
          <View style={styles.profileWrapper}>
            <Avater url={user.profile} />
            <View>
              <P bold size={16} color='green'>
                {user.name}
              </P>
              <P bold size={13} color='darkGray'>
                {user.designation}
              </P>
              <Pressable onPress={() => openNumber(user.phone)}>
                <P color='green'>{user.phone}</P>
              </Pressable>
            </View>
          </View>
          {user?.id === store?.user?.id ||
          store.user.designation === role.admin ? (
            <View style={{ marginTop: 8, flexDirection: "row", columnGap: 10 }}>
              <Button
                onPress={() =>
                  navigation.navigate("balanceTransfer", { user: user })
                }
                title='Money Transfer'
              />
              {user?.id === store?.user?.id ? (
                <>
                  <Button onPress={goForEdit} title='Edit Profile' />
                  <Button
                    style={{ backgroundColor: "#e8a72e" }}
                    onPress={logOut}
                    title='LogOut'
                  />
                </>
              ) : null}
            </View>
          ) : null}
        </View>

        {user?.id === store?.user?.id ||
        store.user.designation === role.admin ? (
          <>
            <Summery user={user} />

            {/* notes  */}
            <Notes id={user.id} navigation={navigation} />

            {money_transactions ? (
              <>
                {/* target report */}
                <Target
                  commision={money_transactions?.commision}
                  user={user}
                  activeUser={store.user}
                />

                {/* money report */}
                <MoneyReport
                  transactions={money_transactions?.transactions}
                  user={store.user}
                />
              </>
            ) : null}
          </>
        ) : null}

        <RecentActivity
          navigation={navigation}
          id={route.params?.userId || store.user.id}
        />
      </ScrollView>
    </Common>
  );
};

export default Profile;

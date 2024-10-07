import { Pressable, ScrollView, Text, View } from "react-native";
import React, { useEffect, useState } from "react";

import { Fetch, dateFormatter, openNumber } from "../../services/common";
import { color } from "../../components/utilitise/colors";
import { alert } from "../../components/utilitise/Alert";
import Button from "../../components/utilitise/Button";
import { Common } from "../../components/Common";
import BDT from "../../components/utilitise/BDT";
import useStore from "../../context/useStore";
import P from "../../components/utilitise/P";

const Commission = ({ navigation }) => {
  const [commissions, setCommissions] = useState(null);
  const [updateCommissions, setUpdateCommissions] = useState(false);
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        const commision = await Fetch(
          store.database.name,
          `/admin/commission?id=${store.user.id}`,
          "GET"
        );
        setCommissions(commision);
      } catch (error) {
        navigation.navigate("error");
      }
    })();
  }, [updateCommissions]);

  async function deleteCommission(id) {
    alert("Are you sure you want to delete?", async () => {
      try {
        store.setLoading(true);
        const { message } = await Fetch(
          store.database.name,
          `/admin/commission?id=${id}`,
          "DELETE"
        );
        store.setMessage({ msg: message, type: "success" });
        setUpdateCommissions((prev) => !prev);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    });
  }
  async function achieveCommissions(data) {
    try {
      store.setLoading(true);

      const result = await Fetch(
        store.database.name,
        "/admin/commission",
        "POST",
        {
          fromUser: store.user.id,
          toUser: data.user_id,
          amount: data.commission,
          purpose: "Incentive",
          commision: data.id,
          id: data.id,
        }
      );
      store.setMessage({ msg: result.message, type: "success" });
      store.setUpdateUser((prev) => !prev);
      setUpdateCommissions((prev) => !prev);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  return (
    <Common>
      <ScrollView style={{ marginBottom: 57 }}>
        <View
          style={{
            paddingHorizontal: 7,
            paddingTop: 10,
            backgroundColor: color.lightGray,
            minHeight: "100%",
          }}
        >
          {commissions ? (
            <>
              {commissions.running ? (
                <>
                  <P bold>Running Targets:</P>
                  {commissions.running.map((comision) => (
                    <List key={comision.id} comision={comision}>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 5,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          onPress={() => deleteCommission(comision)}
                          style={{ backgroundColor: color.orange }}
                          title='Delete'
                        />
                      </View>
                    </List>
                  ))}
                </>
              ) : null}

              {commissions.achieve ? (
                <>
                  <P bold>Achived Targets:</P>
                  {commissions.achieve.map((comision) => (
                    <List key={comision.id} comision={comision}>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 5,
                          justifyContent: "flex-end",
                        }}
                      >
                        {!comision.achieve ? (
                          <Button
                            onPress={() => achieveCommissions(comision)}
                            style={{ backgroundColor: color.green }}
                            title='Achieve'
                          />
                        ) : (
                          <P>{`Achieve & waiting \n for confirming`}</P>
                        )}
                      </View>
                    </List>
                  ))}
                </>
              ) : null}
            </>
          ) : (
            <Text>There is no Running Or pending commission</Text>
          )}
        </View>
      </ScrollView>
    </Common>
  );
};

function List({ comision, children }) {
  return (
    <View
      style={{
        backgroundColor: color.light,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 3,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}
    >
      <View>
        <P>
          <P bold>Employee:</P> {comision.name}
        </P>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            openNumber(comision.phone);
          }}
        >
          <P>
            <P bold>Number:</P>
            <P style={{ color: color.green }}> {comision.phone}</P>
          </P>
        </Pressable>
        <P>
          <P bold>Targeted Amount:</P> <BDT amount={comision.targetedAmnt} />
        </P>
        <P>
          <P bold>achieve:</P> <BDT amount={comision.achiveAmnt} />
        </P>
        <P>
          <P bold>Remaingin:</P>{" "}
          <BDT
            amount={
              comision.targetedAmnt >= comision.achiveAmnt
                ? comision.targetedAmnt - comision.achiveAmnt
                : 0
            }
          />
        </P>
      </View>
      <View>
        <P>
          <P bold>Commission:</P> {comision.commission}{" "}
          {comision.status === "achive" && "%"}
        </P>
        <P>
          <P bold>Status:</P> <P color='orange'>{comision.status}</P>
        </P>

        <P>
          <P bold>Started:</P> {dateFormatter(comision.start_date)}
        </P>
        <P>
          <P bold>Ending:</P> {dateFormatter(comision.end_date)}
        </P>

        {children}
      </View>
    </View>
  );
}

export default Commission;

import React, { useState } from "react";
import { Pressable, View } from "react-native";

import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/profile";
import { Fetch, notify } from "../../services/common";
import BDT from "../utilitise/BDT";
import Button from "../utilitise/Button";
import { color } from "../utilitise/colors";
import P from "../utilitise/P";

const MoneyReport = ({ transactions, user }) => {
  const [showDate, setShowDate] = useState(-1);
  const store = useStore();

  async function achieveBalance(data) {
    try {
      store.setLoading(true);
      const result = await Fetch(
        store.database.name,
        "/user/receive_balance",
        "POST",
        data
      );
      store.setMessage({ msg: result.message, type: "success" });
      store.setUpdateUser((prev) => !prev);
      store.setUpdateReport((prev) => !prev);
      await notify(
        store.database.name,
        "Balance Accepted",
        `Your money transfer accepted by ${user.name}`,
        { type: "balance_accepted", toUser: data.fromUser }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  async function declineRequest(id, toUser) {
    try {
      store.setLoading(true);
      const result = await Fetch(
        store.database.name,
        `/user/decline_balance?id=${id}`,
        "DELETE"
      );
      store.setMessage({ msg: result.message, type: "success" });
      store.setUpdateUser((prev) => !prev);
      await notify(
        store.database.name,
        "Balance Declined",
        `Your money transfer declined by ${user.name}`,
        { type: "balance_decline", toUser }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  return (
    <View>
      <P bold style={commonStyles.heading}>
        Money Report
      </P>
      <View style={{ ...styles.workContainer }}>
        <View style={{ width: "100%" }}>
          <View
            style={{
              ...commonStyles.tableRow,
              justifyContent: "space-between",
            }}
          >
            <P bold>From User</P>
            <P bold>To User</P>
            <P bold>Purpose</P>
            <P bold>Amount</P>
          </View>
          {!transactions.length ? (
            <P align='center'>No money transition pending </P>
          ) : (
            transactions.map((trs, i) => {
              return (
                <Pressable
                  key={trs.id}
                  onPress={() =>
                    setShowDate((prev) => {
                      if (prev === i) return -1;
                      return i;
                    })
                  }
                  style={{
                    rowGap: 3,
                    borderBottomWidth: 1,
                    paddingBottom: 3,
                    borderBottomColor: color.gray,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor: "#e3ac07",
                    }}
                  >
                    <P>{trs.fromUsername.split(" ")[0]}</P>
                    <P>{trs.toUsername.split(" ")[0]}</P>
                    <P>{trs.purpose}</P>
                    <BDT amount={trs.amount} />
                  </View>
                  {showDate === i ? (
                    <>
                      <P align='center' color='darkGray'>
                        Req Time: {new Date(trs.transfer_time).toLocaleString()}
                      </P>
                      <P>
                        <P bold>Notes:</P> {trs.notes || "N/A"}
                      </P>
                    </>
                  ) : null}
                  {trs.toUser === user.id ? (
                    <View
                      style={{
                        justifyContent: "center",
                        flexDirection: "row",
                        width: "100%",
                        columnGap: 10,
                      }}
                    >
                      <Button
                        disabled={store.loading}
                        onPress={() => achieveBalance(trs)}
                        style={{ paddingVertical: 3, width: "45%" }}
                        title='Achieve'
                      />
                      {!trs.commision ? (
                        <Button
                          disabled={store.loading}
                          onPress={() => declineRequest(trs.id, trs.fromUser)}
                          style={{
                            paddingVertical: 3,
                            width: "45%",
                            backgroundColor: color.orange,
                          }}
                          title='Decline'
                        />
                      ) : null}
                    </View>
                  ) : null}
                </Pressable>
              );
            })
          )}
        </View>
      </View>
    </View>
  );
};

export default MoneyReport;

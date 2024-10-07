import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/customer";
import { Fetch, dateFormatter, openNumber } from "../../services/common";
import BDT from "../utilitise/BDT";
import { color } from "../utilitise/colors";
import P from "../utilitise/P";

const RecentActivity = ({ navigation, id }) => {
  const [data, setData] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        const url = `/user/recentactivity?user_id=${id}&today=true`;
        const result = await Fetch(store.database.name, url, "GET");
        setData(result);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      }
    })();
  }, [id, store.updateReport]);

  return (
    <View style={{ marginBottom: 20 }}>
      <P bold style={commonStyles.heading}>
        Today's Activities
      </P>

      {data &&
      !data.orders.length &&
      !data.collections.length &&
      !data.expenseReq.length ? (
        <P align='center' style={{ marginTop: 10 }}>
          No activity
        </P>
      ) : (
        <>
          {data && data.orders.length ? (
            <>
              <P bold size={16} style={{ marginVertical: 10 }}>
                Orders:
              </P>
              <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
                {data.orders.map((order) => (
                  <Pressable
                    key={order.id}
                    style={styles.container}
                    onPress={() =>
                      navigation.navigate("orderDetails", { id: order.id })
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignorders: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignorders: "center",
                        }}
                      >
                        <View style={{ marginLeft: 6 }}>
                          <P size={15} bold>
                            {order.shopName}
                          </P>
                          <P color='darkGray' size={13}>
                            {order.address}
                          </P>
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              openNumber(order.phone);
                            }}
                          >
                            <P color='darkGray' size={13}>
                              {order.phone}
                            </P>
                          </Pressable>

                          <P size={12} color='darkGray'>
                            {dateFormatter(order.date)}
                          </P>
                        </View>
                      </View>
                      <View>
                        <P>
                          Bill no: <BDT amount={order.billno} bdtSign={false} />
                        </P>
                        <P>
                          Toal sale: <BDT amount={order.totalSale} />
                        </P>
                        <P>
                          Due:{" "}
                          <BDT
                            style={{ color: color.orange }}
                            amount={order.due}
                          />
                        </P>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {data && data.collections.length ? (
            <>
              <P bold size={16} style={{ marginVertical: 10 }}>
                Collections:
              </P>
              <View style={{ backgroundColor: "#fff", borderRadius: 10 }}>
                {data.collections.map((coll, i) => (
                  <Pressable
                    key={i}
                    style={styles.container}
                    onPress={() =>
                      navigation.navigate("orderDetails", { id: coll.order_id })
                    }
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignorders: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignorders: "center",
                        }}
                      >
                        <View style={{ marginLeft: 6 }}>
                          <P size={15} bold>
                            {coll.shopName}
                          </P>
                          <P color='darkGray' size={13}>
                            {coll.address}
                          </P>
                          <Pressable
                            onPress={(e) => {
                              e.stopPropagation();
                              openNumber(order.phone);
                            }}
                          >
                            <P color='darkGray' size={13}>
                              {coll.phone}
                            </P>
                          </Pressable>
                          <P size={12} color='darkGray'>
                            Order Date: {dateFormatter(coll.order_date)}
                          </P>
                          <P size={12} color='darkGray'>
                            Coll. Date: {dateFormatter(coll.coll_date)}
                          </P>
                        </View>
                      </View>
                      <View>
                        <P>
                          Bill no: <BDT amount={coll.billno} bdtSign={false} />
                        </P>
                        <P>
                          Total Amount: <BDT amount={coll.totalSale} />
                        </P>
                        <P>
                          Collection: <BDT amount={coll.payment} />
                        </P>
                        <P>
                          Due:{" "}
                          <BDT
                            style={{ color: color.orange }}
                            amount={coll.due}
                          />
                        </P>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          ) : null}

          {data && data.expenseReq.length ? (
            <>
              <P bold size={16} style={{ marginVertical: 10 }}>
                Expense Request:
              </P>
              <View style={{ backgroundColor: "#e6c6b3", borderRadius: 10 }}>
                {data.expenseReq.map((exp) => (
                  <View
                    key={exp.id}
                    style={{
                      ...styles.container,
                      backgroundColor: "#e6c6b3",
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignorders: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignorders: "center",
                        }}
                      >
                        <View style={{ marginLeft: 6 }}>
                          <P bold>
                            Expense type: <P bold={400}>{exp.type}</P>
                          </P>
                          <P color='darkGray' bold>
                            Amount: <P bold={400}>{exp.amount}</P>
                          </P>

                          <P color='darkGray' bold>
                            Req. Date:{" "}
                            <P bold={400}>{dateFormatter(exp.date)}</P>
                          </P>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </>
      )}
    </View>
  );
};

export default RecentActivity;

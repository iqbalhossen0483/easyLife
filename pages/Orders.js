import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { IOScrollView, InView } from "react-native-intersection-observer";

import { Common } from "../components/Common";
import SearchFilter from "../components/SearchFilter";
import Avater from "../components/utilitise/Avater";
import BDT from "../components/utilitise/BDT";
import { color } from "../components/utilitise/colors";
import P from "../components/utilitise/P";
import useStore from "../context/useStore";
import { styles } from "../css/customer";
import { Fetch, dateFormatter } from "../services/common";

const Orders = ({ navigation }) => {
  const [orders, setOrders] = useState(null);
  const [coll, setColl] = useState(false);
  const store = useStore();
  const [page, setPage] = useState(0);
  const [searchtxt, setSearchText] = useState("");

  useEffect(() => {
    if (coll) collections(searchtxt);
    else if (searchtxt) search(searchtxt);
    else fetData(`/order?page=${page}`);

    return () => store.setLoading(false);
  }, [page, store.updateOrder]);

  async function fetData(url) {
    try {
      store.setLoading(true);
      setColl(false);
      setSearchText("");

      const data = await Fetch(store.database.name, url, "GET");
      if (page) {
        setOrders({ count: data.count, data: [...orders.data, ...data.data] });
      } else {
        setOrders(data);
      }
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
      navigation.navigate("error");
    } finally {
      store.setLoading(false);
    }
  }

  async function collections(url, initPage) {
    try {
      store.setLoading(true);

      const data = await Fetch(
        store.database.name,
        `${url}&page=${initPage ? 0 : page}`,
        "GET"
      );
      if (!initPage && page) {
        setOrders({ count: data.count, data: [...orders.data, ...data.data] });
      } else setOrders({ count: data.count, data: data.data });
      setColl(true);
      setSearchText(url);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }
  async function search(query, initPage) {
    try {
      store.setLoading(true);

      const res = await Fetch(
        store.database.name,
        `/order?${query}&page=${initPage ? 0 : page}`,
        "GET"
      );
      if (!initPage && page) {
        setOrders({ count: res.count, data: [...orders.data, ...res.data] });
      } else setOrders({ count: res.count, data: res.data });
      setSearchText(query);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  function initialsearch(value) {
    setPage(0);
    if (coll) initCollSearch(value);
    else search(value, true);
  }

  function initCollSearch(search) {
    setPage(0);
    const cmmurl = `/user/recentactivity?coll=true&${search}`;
    const url =
      store.user.designation === "Admin"
        ? cmmurl
        : cmmurl + `&user_id=${store.user.id}`;
    collections(url, true);
  }

  async function seeAll() {
    setColl(false);
    setSearchText("");
    setPage(0);

    fetData(`/order?page=0`);
  }

  return (
    <Common>
      <IOScrollView style={{ marginBottom: 57 }}>
        <SearchFilter
          placeholder='Shop name Or nddress'
          orderPage={{ initCollSearch, seeAll }}
          search={initialsearch}
        />

        {!store.loading ? (
          <View style={{ marginVertical: 4, marginLeft: 8 }}>
            <P size={13}>
              Showing Result {orders?.data?.length} Of {orders?.count}
            </P>
          </View>
        ) : null}

        {orders?.data?.length ? (
          orders.data.map((item, i, arr) => (
            <InView
              key={i}
              onChange={() => {
                if (
                  orders?.count &&
                  orders?.count !== orders?.data?.length &&
                  i === arr.length - 1
                ) {
                  setPage((prev) => prev + 1);
                }
              }}
            >
              <Pressable
                style={styles.container}
                onPress={() =>
                  navigation.navigate("orderDetails", { id: item.id })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: "50%",
                    }}
                  >
                    <Avater url={item.profile} />

                    <View>
                      <P size={15} bold>
                        {item.shopName}
                      </P>
                      <P color='darkGray' size={13}>
                        {item.address}
                      </P>
                      <P size={12} color='darkGray'>
                        {dateFormatter(item.date)}
                      </P>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "37%",
                    }}
                  >
                    <View>
                      <P>
                        Bill no: <BDT amount={item.billno} bdtSign={false} />
                      </P>
                      <P>
                        Toal {coll ? "Amount" : "sale"}:{" "}
                        <BDT amount={item.totalSale} />
                      </P>
                      {coll ? (
                        <P>
                          Collection: <BDT amount={item.payment} />
                        </P>
                      ) : null}
                      <P>
                        Due:{" "}
                        <BDT
                          style={{ color: color.orange }}
                          amount={item.due}
                        />
                      </P>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 8,
                          width: 8,
                          backgroundColor: item.due ? "#dc2626" : "#22c55e",
                          borderRadius: 50,
                          marginRight: -5,
                        }}
                      />
                      <MaterialIcons
                        style={{ color: color.darkGray }}
                        name='keyboard-arrow-right'
                        size={20}
                        color='black'
                      />
                    </View>
                  </View>
                </View>
                <P color='darkGray' size={13}>
                  {coll ? "Collected" : "Delivered"} By: {item.name}
                </P>
              </Pressable>
            </InView>
          ))
        ) : (
          <P align='center'>No order</P>
        )}
      </IOScrollView>
    </Common>
  );
};

export default Orders;

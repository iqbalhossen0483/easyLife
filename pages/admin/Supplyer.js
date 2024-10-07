import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { IOScrollView, InView } from "react-native-intersection-observer";

import { Common } from "../../components/Common";
import Avater from "../../components/utilitise/Avater";
import BDT from "../../components/utilitise/BDT";
import { color } from "../../components/utilitise/colors";
import P from "../../components/utilitise/P";
import useStore from "../../context/useStore";
import { styles } from "../../css/profile";
import {
  Fetch,
  dateFormatter,
  openNumber
} from "../../services/common";

const Supplyer = ({ route, navigation }) => {
  const [suplier, setSuplier] = useState(null);
  const store = useStore();
  const id = route.params.id;
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const data = await Fetch(
          store.database.name,
          `/supplier?id=${id}&page=${page}`,
          "GET"
        );
        if (page) {
          setSuplier((prev) => {
            prev.orders = [...prev.orders, data?.data.orders];
            return { ...prev };
          });
        } else {
          setSuplier(data);
        }
        store.setLoading(false);
      } catch (error) {
        store.setLoading(false);
        store.setMessage({ msg: error.message, type: "error" });
      }
    })();
  }, [page, id]);

  if (!suplier?.data) return null;
  return (
    <Common>
      <IOScrollView style={{ ...styles.container, marginBottom: 63 }}>
        <View style={styles.profileContainer}>
          <View style={styles.profileWrapper}>
            <Avater url={suplier.data.profile} />
            <View>
              <P size={15} bold>
                {suplier.data.name}
              </P>
              <P size={13}>{suplier.data.address}</P>
              <Pressable onPress={() => openNumber(suplier.data.phone)}>
                <P style={styles.phone}>{suplier.data.phone}</P>
              </Pressable>
            </View>
          </View>

          <View style={{ marginTop: 15 }}>
            <P style={{ color: "#1b39bf" }}>
              Total Purchased: <BDT amount={suplier.data.totalPurchased} />
            </P>
            <P color='green'>
              Amount Given: <BDT amount={suplier.data.giveAmount} />
            </P>
            <P color='orange'>
              Debt Amount: <BDT amount={suplier.data.debtAmount} />
            </P>
            <P color='green'>
              Got Discount: <BDT amount={suplier.data.discount} />
            </P>
          </View>
        </View>

        {!store.loading ? (
          <View style={{ marginVertical: 4, marginLeft: 8 }}>
            <P size={13}>
              Showing Result {suplier.data.orders?.length} Of {suplier?.count}
            </P>
          </View>
        ) : null}

        {suplier.data.orders?.length ? (
          suplier.data.orders.map((item, i, arr) => (
            <InView
              key={item.id}
              onChange={() => {
                if (
                  suplier?.count !== suplier?.data?.orders?.length &&
                  i === arr.length - 1
                ) {
                  setPage((prev) => prev + 1);
                }
              }}
            >
              <Pressable
                onPress={() =>
                  navigation.navigate("purchasedDetails", { id: item.id })
                }
                style={styles.orderContainer}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <View style={{ marginLeft: 6 }}>
                      <P>
                        <P bold> Purchased By:</P> {item.name}
                      </P>
                      <P>
                        <P bold>Total Purchase:</P>{" "}
                        <BDT amount={item.total_amount} />
                      </P>
                    </View>
                  </View>
                  <View>
                    <P>
                      <P bold>Payment:</P>
                      <BDT amount={item.payment} />
                    </P>
                    <P>
                      <P bold>Due:</P>{" "}
                      <BDT
                        style={{ color: item.due ? color.orange : color.black }}
                        amount={item.due}
                      />
                    </P>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        ...styles.sign,
                        backgroundColor: item.due ? "#dc2626" : "#22c55e",
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
                <P size={13} style={{ marginLeft: 7 }}>
                  {dateFormatter(item.date)}
                </P>
              </Pressable>
            </InView>
          ))
        ) : (
          <P align='center'>No Orders</P>
        )}
      </IOScrollView>
    </Common>
  );
};

export default Supplyer;

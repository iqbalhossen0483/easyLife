import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { InView, IOScrollView } from "react-native-intersection-observer";

import { Common } from "../../components/Common";
import { Accordion } from "../../components/utilitise/Accordion";
import BDT from "../../components/utilitise/BDT";
import { color } from "../../components/utilitise/colors";
import P from "../../components/utilitise/P";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/production";
import { dateFormatter, Fetch } from "../../services/common";

const ProductionHistory = () => {
  const [production, setProduction] = useState(null);
  const [show, setShow] = useState(-1);
  const [page, setPage] = useState(0);
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const data = await Fetch(
          store.database.name,
          `/production?page=${page}`,
          "GET"
        );
        if (page === 0) setProduction(data);
        else
          setProduction({
            count: data.count,
            data: [...production.data, ...data.data],
          });
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    })();
  }, [page]);

  const rowStyle = {
    width: "40%",
    borderRightWidth: 1,
    borderRightColor: color.gray,
    paddingVertical: 6,
    paddingHorizontal: 16,
  };
  if (!production) return null;
  return (
    <Common>
      <IOScrollView style={{ marginBottom: 57 }}>
        {!store.loading ? (
          <View style={{ marginVertical: 4, marginLeft: 8 }}>
            <P size={13}>
              Showing Result {production.data.length} Of {production.count}
            </P>
          </View>
        ) : null}

        {production.data.map((item, i, arr) => (
          <InView
            key={item.id}
            style={styles.container}
            onChange={() => {
              if (
                production?.count &&
                production?.count !== production?.data?.length &&
                i === arr.length - 1
              ) {
                setPage((prev) => prev + 1);
              }
            }}
          >
            <Accordion
              current={i}
              show={show}
              setShow={setShow}
              title={
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <P>
                      Product Name: <P bold>{item.product_name}</P>
                    </P>
                    <P>
                      Production Amount:{" "}
                      <BDT amount={item.production} bdtSign={false} />
                      kg
                    </P>
                    <P>
                      Production By: <P bold>{item.production_by}</P>
                    </P>
                  </View>
                  <Pressable
                    onPress={() =>
                      setShow((prev) => {
                        if (prev === item.id) return 0;
                        else return item.id;
                      })
                    }
                    style={{ justifyContent: "space-between" }}
                  >
                    <P>Date: {dateFormatter(item.date)}</P>
                    <View style={{ alignItems: "flex-end" }}>
                      <AntDesign
                        name={show === item.id ? "caretup" : "caretdown"}
                        size={20}
                        color={color.darkGray}
                      />
                    </View>
                  </Pressable>
                </View>
              }
              body={
                <View style={{ alignItems: "center" }}>
                  <View style={{ marginTop: 15, width: "80%" }}>
                    <View style={commonStyles.tableRow}>
                      <P style={{ ...rowStyle, width: "60%" }}>Name</P>
                      <P style={{ ...rowStyle, borderRightWidth: 0 }}>Qty</P>
                    </View>
                    {item.list.map((list) => (
                      <View
                        style={{ ...commonStyles.tableRow, borderTopWidth: 0 }}
                        key={list.id}
                      >
                        <P style={{ ...rowStyle, width: "60%" }}>{list.name}</P>
                        <P style={{ ...rowStyle, borderRightWidth: 0 }}>
                          <BDT amount={list.production} bdtSign={false} />
                        </P>
                      </View>
                    ))}
                    <View style={{ alignItems: "flex-end" }}>
                      <P bold style={{ width: "40%", padding: 5 }}>
                        Total: <BDT amount={item.production} bdtSign={false} />
                        kg
                      </P>
                    </View>
                  </View>
                </View>
              }
            />
          </InView>
        ))}
      </IOScrollView>
    </Common>
  );
};

export default ProductionHistory;

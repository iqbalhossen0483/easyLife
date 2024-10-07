import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { Common } from "../../components/Common";
import Drawar from "../../components/Drawar";
import SeeCollectionList from "../../components/order/SeeCollectionList";
import CollectionForm from "../../components/purchase/Collection";
import BDT from "../../components/utilitise/BDT";
import Button from "../../components/utilitise/Button";
import { color } from "../../components/utilitise/colors";
import P from "../../components/utilitise/P";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/orderDetails";
import { Fetch, dateFormatter, serverUrl } from "../../services/common";

const PurchasedDetails = ({ route }) => {
  const [showCollnForm, setShowCollForm] = useState(false);
  const [showCollInfo, setShowCollInfo] = useState(false);
  const [data, setData] = useState(null);
  const [showImg, setShowImg] = useState("");
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const result = await Fetch(
          store.database.name,
          `/purchase?id=${route.params?.id}`,
          "GET"
        );
        setData(result);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    })();
  }, [route.params?.id, store.updatePurchase]);

  if (!data) return null;
  return (
    <Common>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <P align='center' bold size={18} style={{ color: color.light }}>
            {store.database?.title}
          </P>
          <P align='center' size={13} style={{ color: color.light }}>
            {store.database?.address}
          </P>
        </View>
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <View style={styles.dateNbill}>
            <P>
              <P bold>Date: </P>
              {dateFormatter(data.date)}
            </P>
          </View>

          <View style={{ flexDirection: "row", columnGap: 5, marginTop: 5 }}>
            <P bold>Name:</P>
            <Text style={styles.shopNameNaddress}>{data.name}</Text>
          </View>
          <View style={{ flexDirection: "row", columnGap: 5 }}>
            <P bold>Address:</P>
            <Text style={styles.shopNameNaddress}>{data.address}</Text>
          </View>

          {/* details */}
          <View style={styles.detailsWrapper}>
            <View
              style={{
                ...commonStyles.tableRow,
                justifyContent: "space-between",
              }}
            >
              <P bold style={{ width: "40%" }}>
                Product
              </P>
              <P bold style={{ width: "20%" }}>
                Qty
              </P>
              <P bold style={{ width: "20%" }}>
                Price
              </P>
              <P bold style={{ width: "20%" }}>
                Total
              </P>
            </View>
            {data.products.length ? (
              data.products.map((item) => (
                <View
                  key={item.id}
                  style={{
                    ...commonStyles.tableRow,
                    borderTopWidth: 0,
                  }}
                >
                  <P style={{ width: "40%" }}>{item.full_name}</P>
                  <P style={{ width: "20%" }}>{item.qty}</P>
                  <P style={{ width: "20%" }}>
                    <BDT amount={item.price} />
                  </P>
                  <P style={{ width: "20%" }}>
                    <BDT amount={item.total} />
                  </P>
                </View>
              ))
            ) : (
              <P align='center'>No product</P>
            )}
            <View
              style={{
                marginTop: 10,
                alignItems: "flex-end",
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ gap: 5 }}>
                  <P
                    bold
                    style={{
                      borderBottomWidth: 1,
                      borderColor: color.gray,
                      paddingEnd: 5,
                    }}
                  >
                    Total:
                  </P>
                  <P
                    bold
                    style={{
                      borderBottomWidth: 1,
                      borderColor: color.gray,
                      paddingEnd: 5,
                    }}
                  >
                    Payment:
                  </P>
                  <P
                    bold
                    style={{
                      borderBottomWidth: 1,
                      borderColor: color.gray,
                      paddingEnd: 5,
                    }}
                  >
                    Due:
                  </P>
                </View>
                <View style={{ gap: 5 }}>
                  <BDT
                    style={{ borderBottomWidth: 1, borderColor: color.gray }}
                    amount={data.total_amount}
                  />
                  <BDT
                    style={{ borderBottomWidth: 1, borderColor: color.gray }}
                    amount={data.payment}
                  />
                  <BDT
                    style={{
                      borderBottomWidth: 1,
                      borderColor: color.gray,
                      color: data.due ? color.orange : color.black,
                    }}
                    amount={data.due}
                  />
                </View>
              </View>

              {data.due !== 0 && (
                <Button
                  onPress={() => setShowCollForm(true)}
                  style={{ marginVertical: 5 }}
                  title='Give Payment'
                />
              )}
              {data.collections.length !== 0 && (
                <Button
                  onPress={() => setShowCollInfo(true)}
                  title='See Collection Info'
                />
              )}
            </View>
          </View>
        </View>
        <P style={{ marginVertical: 5 }}>
          <P bold>Notes: </P>
          {data.payment_info}
        </P>
        <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
          {data.files
            ? data.files.split(",").map((img, i) => {
                if (img)
                  return (
                    <Pressable key={i} onPress={() => setShowImg(img)}>
                      <Image
                        source={{ uri: serverUrl + img }}
                        style={{
                          width: 100,
                          height: 60,
                          resizeMode: "cover",
                        }}
                      />
                    </Pressable>
                  );
                else null;
              })
            : null}
        </View>

        {showCollnForm && (
          <CollectionForm
            purchase={true}
            data={data}
            setShow={setShowCollForm}
          />
        )}
        {showCollInfo && (
          <SeeCollectionList
            data={data.collections}
            setShow={setShowCollInfo}
          />
        )}
        <Drawar
          setShowModal={() => setShowImg("")}
          width='100%'
          show={showImg ? true : false}
        >
          {showImg ? (
            <Image
              source={{ uri: serverUrl + showImg }}
              style={{
                width: "100%",
                height: 190,
                resizeMode: "cover",
                marginTop: 10,
              }}
            />
          ) : null}
        </Drawar>
      </View>
    </Common>
  );
};

export default PurchasedDetails;

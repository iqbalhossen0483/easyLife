import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard, Pressable, TextInput, View } from "react-native";

import { Common } from "../components/Common";
import BDT from "../components/utilitise/BDT";
import Button from "../components/utilitise/Button";
import { color } from "../components/utilitise/colors";
import P from "../components/utilitise/P";
import useStore from "../context/useStore";
import { commonStyles } from "../css/common";
import { styles } from "../css/orderDetails";
import { Fetch, dateFormatter, notify } from "../services/common";

const CompleteOrder = ({ route, navigation }) => {
  const [payment, setPayment] = useState(0);
  const [data, setData] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const url = `/order?id=${route.params?.id}`;
        const result = await Fetch(store.database.name, url, "GET");
        setData(result);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    })();
  }, [route.params?.id, store.updateOrder]);

  async function completeOrder(discount, due) {
    try {
      Keyboard.dismiss();
      store.setLoading(true);
      const peyload = {
        payment,
        due,
        discount,
        shopId: data.shopId,
        delivered_by: store.user.id,
        created_by: data.created_by,
        prevSale: data.prevSale,
        forShop: {
          totalSale: data.totalSale,
          dueSale: due,
          due,
          discount,
          commission: data.commission,
        },
      };
      const url = `/order?id=${route.params?.id}`;
      const { message } = await Fetch(store.database.name, url, "PUT", peyload);
      store.setMessage({ msg: message, type: "success" });
      navigation.goBack();

      store.setUpdateOrder((prev) => !prev);
      store.setUpdateReport((prev) => !prev);
      store.setUpdateUser((prev) => !prev);
      store.setUpNotification((prev) => !prev);
      await notify(
        store.database.name,
        "Complete Order",
        `An order completed by ${store.user.name}`,
        { type: "completeOrder", id: store.user.id }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  if (!data) return null;
  const disable =
    payment > data.totalSale ||
    payment <= data.totalSale - data.totalSale * 0.03;
  return (
    <Common>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <P align='center' bold size={18} color='light'>
            {store.database.name}
          </P>
          <P align='center' color='light'>
            {store.database.address}
          </P>
        </View>
        <View style={{ padding: 15 }}>
          <View style={styles.shopwrapper}>
            <View>
              <P size={15} bold>
                {data.shopName}
              </P>
              <P color='darkGray'>{data.address}</P>
            </View>
            <View>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <P color='darkGray'>Bill no:</P>
                <P color='darkGray'>{data.billno}</P>
              </View>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <P color='darkGray'>Date:</P>
                <P color='darkGray'>{dateFormatter(data.date)}</P>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <Pressable
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
                onPress={() =>
                  navigation.navigate("createOrder", {
                    edit: true,
                    order: data,
                  })
                }
              >
                <View style={{ flexDirection: "row", gap: 3 }}>
                  <P>Total Amount:</P>
                  <BDT amount={data.totalSale} />
                </View>

                <FontAwesome5 name='edit' size={16} color={color.orange} />
              </Pressable>
              {payment ? <P>Due Amount: {data.totalSale - payment}৳</P> : null}
            </View>
          </View>

          <TextInput
            style={commonStyles.input}
            onChangeText={(value) => setPayment(parseInt(value || 0))}
            placeholder='Payment ৳'
            keyboardType='numeric'
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              marginTop: 6,
            }}
          >
            <Button
              onPress={() => completeOrder(data.totalSale - payment, 0)}
              disabled={store.loading || disable}
              title={payment >= data.totalSale ? "Complete" : "Discount"}
            />
            <Button
              onPress={() => completeOrder(0, data.totalSale - payment)}
              disabled={store.loading || payment >= data.totalSale}
              title='Continue with due'
            />
          </View>
        </View>
      </View>
    </Common>
  );
};

export default CompleteOrder;

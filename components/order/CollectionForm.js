import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Keyboard, TextInput, View } from "react-native";

import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/orderDetails";
import { Fetch } from "../../services/common";
import Button from "../utilitise/Button";
import P from "../utilitise/P";

const CollectionForm = ({ setShow, data }) => {
  const [payment, setPayment] = useState(0);
  const store = useStore();

  async function getCollection(discount, due) {
    try {
      store.setLoading(true);
      Keyboard.dismiss();
      const peyload = {
        payment,
        due,
        discount,
        shopId: data.shopId,
        collected_by: store.user.id,
        date: data.date,
        collection: {
          receiverId: store.user.id,
          amount: payment,
          orderId: data.id,
        },
      };
      const url = `/order?id=${data.id}&collection=true`;
      const { message } = await Fetch(store.database.name, url, "PUT", peyload);
      store.setMessage({ msg: message, type: "success" });
      store.setUpdateOrder((prev) => !prev);
      store.setUpdateReport((prev) => !prev);
      store.setUpdateUser((prev) => !prev);
      store.setUpdateCustomer((prev) => !prev);
      setShow(false);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }
  const disable =
    payment > data.due || payment <= data.due - data.totalSale * 0.03;
  return (
    <View style={styles.collectionContainer}>
      <View
        onTouchStart={() => setShow(false)}
        style={commonStyles.closeIconWrapper}
      >
        <Ionicons
          style={commonStyles.closeIcon}
          name='close-sharp'
          size={24}
          color='black'
        />
      </View>
      <View style={{ width: "80%" }}>
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <P size={17} bold style={{ color: "#dc2626" }}>
            Due: {data.due - payment}৳
          </P>
        </View>
        <TextInput
          style={{ ...commonStyles.input, marginVertical: 20 }}
          placeholder='Collection ৳'
          keyboardType='numeric'
          onChangeText={(value) => setPayment(parseInt(value || 0))}
        />
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
          }}
        >
          <Button
            disabled={disable || store.loading}
            onPress={() =>
              getCollection(
                data.totalSale - data.payment - parseInt(payment),
                0
              )
            }
            title={payment === data.due ? "Complete" : "Discount"}
          />
          <Button
            onPress={() => getCollection(0, data.due - parseInt(payment))}
            disabled={!payment || payment >= data.due || store.loading}
            title='Continue with due'
          />
        </View>
      </View>
    </View>
  );
};

export default CollectionForm;

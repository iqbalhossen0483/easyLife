import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Keyboard, Pressable, TextInput, View } from "react-native";

import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { styles } from "../../css/orderDetails";
import { Fetch } from "../../services/common";
import Button from "../utilitise/Button";
import { color } from "../utilitise/colors";
import FileInput from "../utilitise/FileInput";
import P from "../utilitise/P";

const CollectionForm = ({ setShow, data }) => {
  const [payment, setPayment] = useState(0);
  const [files, setFiles] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(data.payment_info);
  const store = useStore();
  async function getCollection(discount, due) {
    try {
      store.setLoading(true);
      Keyboard.dismiss();
      const peyload = {
        payment,
        due,
        discount,
        supplierId: data.supplier_id,
        sent_by: store.user.id,
        files: data.files,
        payment_info: paymentInfo,
        collection: JSON.stringify({
          senderId: store.user.id,
          amount: payment,
          orderId: data.id,
        }),
      };
      const url = `/purchase/collection?id=${data.id}&collection=true`;
      const formData = new FormData();
      Object.entries(peyload).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (files.length) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }
      const { message } = await Fetch(
        store.database.name,
        url,
        "PUT",
        formData,
        true
      );
      store.setMessage({ msg: message, type: "success" });
      store.setUpdatePurchase((prev) => !prev);
      store.setUpdateUser((prev) => !prev);
      store.setUpdateReport((prev) => !prev);
      setShow(false);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  function addfile(file) {
    setFiles((prev) => {
      file.id = prev.length;
      prev.push(file);
      return [...prev];
    });
  }

  function removeFile(id) {
    setFiles((prev) => {
      const rest = prev.filter((file) => file.id !== id);
      return [...rest];
    });
  }

  const disable =
    payment > data.due || payment <= data.due - data.total_amount * 0.03;
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
      <View style={{ width: "80%", gap: 10 }}>
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
          style={{ ...commonStyles.input, marginTop: 20 }}
          placeholder='Collection ৳'
          keyboardType='numeric'
          onChangeText={(value) => setPayment(parseInt(value || 0))}
        />

        <TextInput
          onChangeText={(value) => setPaymentInfo(value)}
          style={{
            ...commonStyles.input,
            textAlignVertical: "top",
            paddingTop: 5,
            height: 100,
          }}
          editable={payment ? true : false}
          placeholder='Payment Information'
          defaultValue={paymentInfo}
          multiline
        />
        <View style={{ gap: 10 }}>
          {files.length ? (
            <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
              {files.map((file) => (
                <Pressable key={file.id} onPress={() => removeFile(file.id)}>
                  <Image
                    source={{ uri: file.uri }}
                    style={{
                      width: 100,
                      height: 60,
                      resizeMode: "cover",
                    }}
                  />
                  <Ionicons
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      backgroundColor: color.gray,
                    }}
                    name='close-sharp'
                    size={20}
                    color='black'
                  />
                </Pressable>
              ))}
            </View>
          ) : null}
          <FileInput setImage={(file) => addfile(file)} title='Add file +' />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "space-between",
          }}
        >
          <Button
            disabled={disable}
            onPress={() =>
              getCollection(
                data.total_amount - data.payment - parseInt(payment),
                0
              )
            }
            title={payment === data.due ? "Complete" : "Discount"}
          />
          <Button
            onPress={() => getCollection(0, data.due - parseInt(payment))}
            disabled={!payment || payment >= data.due}
            title='Continue with due'
          />
        </View>
      </View>
    </View>
  );
};

export default CollectionForm;

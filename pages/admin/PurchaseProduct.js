import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { Common } from "../../components/Common";
import AddProduct from "../../components/createorder/AddProduct";
import Product from "../../components/createorder/Product";
import { alert } from "../../components/utilitise/Alert";
import BDT from "../../components/utilitise/BDT";
import Button from "../../components/utilitise/Button";
import { color } from "../../components/utilitise/colors";
import FileInput from "../../components/utilitise/FileInput";
import P from "../../components/utilitise/P";
import Select from "../../components/utilitise/Select";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { Fetch } from "../../services/common";

const PurchaseProduct = ({ navigation }) => {
  const [data, setData] = useState({
    supplierId: 0,
    products: [],
    totalSale: 0,
    giveAmount: 0,
    payment_info: "",
    files: [],
  });
  const [show, setShow] = useState(false);
  const [bottomMargin, setBottomMargin] = useState(57);

  const store = useStore();

  function onSubmit() {
    const txtMessage =
      "Please be sure to purchase.\n After purchasing you won't change it anymore";
    alert(txtMessage, async () => {
      try {
        store.setLoading(true);
        data.userId = store.user.id;

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (key === "files") {
            value.forEach((file) => formData.append("files", file));
          } else if (key === "products") {
            formData.append("products", JSON.stringify(value));
          } else formData.append(key, value);
        });

        const { message } = await Fetch(
          store.database.name,
          "/purchase",
          "POST",
          formData,
          true
        );
        store.setMessage({ msg: message, type: "success" });
        store.setUpdateReport((prev) => !prev);
        store.setUpdateUser((prev) => !prev);
        navigation.goBack();
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    });
  }

  function addfile(file) {
    setData((prev) => {
      file.id = prev.files.length;
      prev.files.push(file);
      return { ...prev };
    });
  }

  function removeFile(id) {
    setData((prev) => {
      const rest = prev.files.filter((file) => file.id !== id);
      prev.files = rest;
      return { ...prev };
    });
  }

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", (event) => {
      setBottomMargin(event.endCoordinates.height);
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => {
      setBottomMargin(57);
    });

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Common>
      <ScrollView style={{ marginBottom: bottomMargin }}>
        <View style={commonStyles.formContainer}>
          <P bold style={commonStyles.formHeader}>
            Purchase Product
          </P>
          <View style={{ rowGap: 10, zIndex: 0 }}>
            <Select
              header='name'
              zIndex={200}
              name='supplier'
              placeholder='Type supplier name'
              url={"/supplier?opt=id,name"}
              search={true}
              height='auto'
              handler={(_, info) =>
                setData((prev) => {
                  return { ...prev, supplierId: info.id };
                })
              }
            />

            {data.supplierId ? (
              <>
                <P
                  bold
                  align='center'
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: color.gray,
                  }}
                >
                  Product List
                </P>
                {data.products.length ? (
                  <View style={{ marginTop: -14 }}>
                    <Product products={data.products} setForm={setData} />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-end",
                      }}
                    >
                      <P>Total: </P>
                      <P bold>
                        <BDT amount={data.totalSale} />
                      </P>
                    </View>
                  </View>
                ) : (
                  <P align='center'>No product</P>
                )}

                <Button
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    paddingHorizontal: 3,
                    paddingVertical: 5,
                    alignSelf: "flex-end",
                  }}
                  onPress={() => setShow((prev) => !prev)}
                  title={<AntDesign name='pluscircle' size={18} color='#fff' />}
                />
              </>
            ) : null}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <P
                bold
                style={{
                  borderWidth: 1,
                  borderColor: color.gray,
                  paddingLeft: 6,
                  paddingVertical: 9,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  backgroundColor: color.lightGray,
                  width: "30%",
                }}
              >
                Give Amount
              </P>
              <TextInput
                style={{
                  ...commonStyles.input,
                  width: "70%",
                  borderBottomEndRadius: 5,
                  borderTopEndRadius: 5,
                  borderBottomLeftRadius: 0,
                  borderTopLeftRadius: 0,
                }}
                onChangeText={(value) =>
                  setData((prev) => {
                    return { ...prev, giveAmount: parseInt(value) };
                  })
                }
                placeholder='Give amount ৳'
                keyboardType='phone-pad'
              />
            </View>

            <TextInput
              onChangeText={(value) =>
                setData((prev) => {
                  return { ...prev, payment_info: value };
                })
              }
              editable={data.giveAmount ? true : false}
              style={{
                textAlignVertical: "top",
                ...commonStyles.input,
                paddingTop: 5,
                height: 100,
              }}
              placeholder='Payment Information'
              multiline
            />
            {data.files.length ? (
              <View style={{ flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
                {data.files.map((file) => (
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
            <FileInput
              disable={!data.payment_info}
              setImage={(file) => addfile(file)}
              title='Add file +'
            />

            <Button
              title='Submit'
              onPress={onSubmit}
              disabled={
                store.loading ||
                !data.supplierId ||
                !data.products.length ||
                data.totalSale < data.giveAmount
              }
            />
          </View>
        </View>
        <AddProduct
          setForm={setData}
          products={data.products}
          setShow={setShow}
          show={show}
        />
      </ScrollView>
    </Common>
  );
};

export default PurchaseProduct;

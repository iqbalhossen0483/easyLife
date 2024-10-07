import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Keyboard, ScrollView, TextInput, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Common } from "../../components/Common";
import Product from "../../components/createorder/Product";
import Drawar from "../../components/Drawar";
import { alert } from "../../components/utilitise/Alert";
import Button from "../../components/utilitise/Button";
import { color } from "../../components/utilitise/colors";
import P from "../../components/utilitise/P";
import Select from "../../components/utilitise/Select";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { Fetch } from "../../services/common";

const Production = ({ navigation }) => {
  const [bottomMargin, setBottomMargin] = useState(57);
  const [show, setShow] = useState(false);
  const store = useStore();
  const [data, setData] = useState({
    id: 0,
    totalSale: 0,
    stock: 0,
    products: [],
  });

  useEffect(() => {
    (async () => {
      if (data.id === 0) return;
      const list = await AsyncStorage.getItem(data.id + "");
      const listData = JSON.parse(list);

      if (list)
        setData((prev) => {
          return {
            ...prev,
            products: listData.data,
            totalSale: listData.totalSale,
          };
        });
    })();
  }, [data.id]);

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

  function onSubmit() {
    const txtMessage =
      "Please be sure to purchase.\nAfter purchasing you won't change it anymore";
    alert(txtMessage, async () => {
      try {
        store.setLoading(true);
        const payload = {
          productId: data.id,
          production: data.totalSale,
          stock: data.stock,
          list: data.products,
          production_by: store.user.id,
        };

        const { message } = await Fetch(
          store.database.name,
          "/production",
          "POST",
          payload
        );
        await AsyncStorage.removeItem(payload.productId + "");
        await AsyncStorage.setItem(
          payload.productId + "",
          JSON.stringify({ totalSale: data.totalSale, data: payload.list })
        );
        store.setMessage({
          msg: `${message} \n List added to the store`,
          type: "success",
        });
        store.setUpdateReport((prev) => !prev);
        navigation.goBack();
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    });
  }

  return (
    <Common>
      <ScrollView style={{ marginBottom: bottomMargin }}>
        <View style={commonStyles.formContainer}>
          <P bold style={commonStyles.formHeader}>
            Add Production Info
          </P>
          <View style={{ rowGap: 10, zIndex: 0 }}>
            <Select
              header='name'
              zIndex={200}
              height={200}
              url='/product?opt=id,name,stock'
              search={true}
              placeholder='Select product'
              handler={(_, info) =>
                setData((prev) => {
                  return { ...prev, id: info.id, stock: info.stock };
                })
              }
            />

            {data.products.length ? (
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: "80%",
                    borderWidth: 1,
                    borderColor: color.gray,
                    paddingVertical: 7,
                    paddingHorizontal: 16,
                    borderRadius: 7,
                  }}
                >
                  <Product
                    production={true}
                    products={data.products}
                    setForm={setData}
                  />
                  <View
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    <P>Total: </P>
                    <P bold>{data.totalSale.toFixed(2)} kg</P>
                  </View>
                </View>
              </View>
            ) : null}

            <View style={{ alignItems: "flex-end" }}>
              <Button
                onPress={() => setShow((prev) => !prev)}
                disabled={!data.id}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                title={<AntDesign name='pluscircle' size={22} color='#fff' />}
              />
            </View>

            <Button
              title='Submit'
              onPress={onSubmit}
              disabled={store.loading || !data.products.length || !data.id}
            />
          </View>
        </View>

        <AddProduct setShow={setShow} show={show} setData={setData} />
      </ScrollView>
    </Common>
  );
};

function AddProduct({ show, setShow, setData }) {
  const [product, setProduct] = useState(null);

  function addtolist() {
    setData((prev) => {
      const isExist = prev.products.find((pro) => pro.id === product.id);
      if (!isExist)
        return {
          ...prev,
          products: [...prev.products, product],
          totalSale: prev.totalSale + product.qty,
        };
      else {
        alert("Product already exists");
        return { ...prev };
      }
    });
    setShow(false);
  }

  return (
    <Drawar
      show={show}
      setShowModal={() => setShow(false)}
      coverScreen={true}
      bottom={20}
    >
      <P align='center' bold style={{ marginBottom: 4 }}>
        Add Ratio
      </P>
      <Select
        placeholder='Select Product'
        url='/product?opt=id,name, stock'
        header='name'
        search={true}
        height='auto'
        handler={(_, info) =>
          setProduct((prev) => {
            return { ...prev, ...info };
          })
        }
      />

      <TextInput
        style={commonStyles.input}
        placeholder='Qty'
        keyboardType='phone-pad'
        onChangeText={(value) =>
          setProduct((prev) => {
            return {
              ...prev,
              qty: parseFloat(value),
              total: parseFloat(value),
            };
          })
        }
      />

      <Button
        style={{ marginTop: 5 }}
        disabled={!product?.id || !product.qty}
        title='Add'
        onPress={addtolist}
      />
    </Drawar>
  );
}

export default Production;

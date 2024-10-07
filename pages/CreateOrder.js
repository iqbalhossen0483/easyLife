import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, TextInput, View } from "react-native";

import { Common } from "../components/Common";
import AddProduct from "../components/createorder/AddProduct";
import PreviousOrder from "../components/createorder/PreviousOrder";
import Product from "../components/createorder/Product";
import BDT from "../components/utilitise/BDT";
import Button from "../components/utilitise/Button";
import P from "../components/utilitise/P";
import Select from "../components/utilitise/Select";
import useStore from "../context/useStore";
import { commonStyles } from "../css/common";
import { Fetch, notify } from "../services/common";

const CreateOrder = ({ route, navigation }) => {
  const [show, setShow] = useState(false);
  const store = useStore();

  const [form, setForm] = useState({
    shopInfo: {},
    products: [],
    totalSale: 0,
    billno: 0,
    prevSale: false,
  });

  //for editing initialize;
  useEffect(() => {
    const order = route.params?.order;
    if (!route.params?.edit) return;
    setForm({
      shopInfo: {
        id: order.shopId,
        shopName: order.shopName,
        address: order.address,
        phone: order.phone,
      },
      products: order.products,
      totalSale: order.totalSale,
      billno: order.billno,
      prevSale: order.prevSale === "false" ? false : true,
    });
  }, [route.params]); //till;

  function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }

  async function onSubmit() {
    try {
      store.setLoading(true);
      const edit = route.params?.edit;
      const data = { ...form };
      data.shopId = data.shopInfo.id;
      delete data.shopInfo;
      data.deleteProduct;
      data.created_by = store.user.id;
      if (!edit) {
        const date = new Date();
        data.time = formatAMPM(date);
      }
      const method = edit ? "PUT" : "POST";
      const url = edit
        ? `/order?id=${route.params?.order.id}&editOrder=true`
        : "/order";
      const { message } = await Fetch(store.database.name, url, method, data);
      store.setMessage({ msg: message, type: "success" });
      navigation.goBack();
      store.setUpdateOrder((prev) => !prev);
      store.setUpNotification((prev) => !prev);
      store.setLoading(false);
      await notify(
        store.database.name,
        "Order Created",
        `An order has been created by ${store.user.name}`,
        { type: "createdOrder", id: store.user.id }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
      store.setLoading(false);
    }
  }

  const disable = form.prevSale ? !form.totalSale : !form.products.length;
  return (
    <Common>
      <ScrollView style={{ marginBottom: 57 }}>
        <View style={commonStyles.formContainer}>
          <P bold style={commonStyles.formHeader}>
            {route.params?.edit ? "Edit" : "Create"} Order
          </P>
          <View style={{ rowGap: 5, overflow: "visible" }}>
            <Select
              name='shopInfo'
              placeholder='Shop name'
              url='/customer?opt=id,shopName,address,phone'
              search={true}
              defaultValue={route.params?.edit && form.shopInfo?.shopName}
              header='shopName'
              title='address'
              height='auto'
              handler={(_, info) =>
                setForm((prev) => {
                  return {
                    ...prev,
                    shopInfo: {
                      id: info.id,
                      shopName: info.shopName,
                      address: info.address,
                      phone: info.phone,
                    },
                  };
                })
              }
            />
            <TextInput
              onChangeText={(value) =>
                setForm((prev) => {
                  return { ...prev, billno: value };
                })
              }
              keyboardType='phone-pad'
              defaultValue={form.billno ? form.billno.toString() : ""}
              style={commonStyles.input}
              placeholder='Bill no.'
            />

            {form.shopInfo?.address && (
              <>
                <TextInput
                  style={commonStyles.input}
                  editable={false}
                  value={form.shopInfo.address}
                />
                <TextInput
                  style={commonStyles.input}
                  editable={false}
                  value={form.shopInfo.phone}
                />
              </>
            )}

            {form.products.length ? (
              <>
                <Product products={form.products} setForm={setForm} />
                <View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}
                >
                  <P>Total: </P>
                  <BDT amount={form.totalSale} />
                </View>
              </>
            ) : null}

            <View style={{ alignItems: "flex-end" }}>
              <Button
                onPress={() => setShow((prev) => !prev)}
                disabled={!form.shopInfo?.id || form.prevSale}
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

            {/* in case of Previous sold order; */}
            {store.user.designation === "Admin" ? (
              <PreviousOrder form={form} setForm={setForm} />
            ) : null}

            {/* create order */}
            <Button
              disabled={store.loading || !form.shopInfo?.id || disable}
              onPress={onSubmit}
              title='Submit'
            />
          </View>

          {/* add product form */}
          <AddProduct
            products={form.products}
            setForm={setForm}
            setShow={setShow}
            show={show}
            form={form}
          />
        </View>
      </ScrollView>
    </Common>
  );
};

export default CreateOrder;

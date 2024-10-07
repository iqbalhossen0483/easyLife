import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Image, Pressable, View } from "react-native";
import React, { useEffect, useState } from "react";

import { color } from "../../components/utilitise/colors";
import { alert } from "../../components/utilitise/Alert";
import { Fetch, serverUrl } from "../../services/common";
import Button from "../../components/utilitise/Button";
import SubMenu from "../../components/footer/SubMenu";
import { Common } from "../../components/Common";
import { styles } from "../../css/manageProduct";
import useStore from "../../context/useStore";
import Drawar from "../../components/Drawar";
import P from "../../components/utilitise/P";

const ManageProduct = ({ navigation }) => {
  const [showForm, setShowFrom] = useState(null);
  const [products, setProducts] = useState(null);
  const { setMessage, setLoading, updateProduct, database } = useStore();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const products = await Fetch(database.name, "/product", "GET");
        setProducts(products);
      } catch (error) {
        setMessage({ msg: error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    })();
    return () => setLoading(false);
  }, [updateProduct]);

  function removeProduct(id, profile) {
    alert("Are you sure to remove?", async () => {
      try {
        setLoading(true);
        const { message } = await Fetch(
          database.name,
          `/product?id=${id}&profile=${profile}`,
          "DELETE"
        );

        setMessage({ msg: message, type: "success" });
        const rest = products.filter((product) => product.id !== id);
        setProducts(rest);
      } catch (error) {
        setMessage({ msg: error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <Common>
      <View style={styles.addBtn}>
        <Button
          style={{ width: 40, height: 40, borderRadius: 100 }}
          title={
            <AntDesign
              onPress={() => navigation.navigate("addProduct")}
              name='pluscircle'
              size={22}
              color='#fff'
            />
          }
        />
      </View>
      <FlatList
        style={{ marginBottom: 57 }}
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ marginBottom: 6 }} />}
        ListEmptyComponent={() => <P align='center'>No product</P>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.itemContainer}
            onPress={() => setShowFrom(item)}
          >
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              {item.profile && item.profile !== "null" ? (
                <Image
                  style={{ width: 100, height: 100, borderRadius: 5 }}
                  source={{ uri: serverUrl + item.profile }}
                  alt=''
                />
              ) : (
                <Image
                  style={{ width: 100, height: 100, borderRadius: 5 }}
                  source={require("../../assets/no-photo.png")}
                  alt=''
                />
              )}
              <View>
                <P size={15} bold>
                  {item.name}
                </P>
                <P>Price: {item.price}</P>
                <P>Total Purchased: {item.purchased}</P>
                <P>Total Sold: {item.sold}</P>
                <P>Remain Stock: {item.stock}</P>
                <P>Type: {item.type}</P>
                <P>SL: {item.sl || "N/A"}</P>
              </View>
            </View>
          </Pressable>
        )}
      />
      <Drawar
        setShowModal={() => setShowFrom(null)}
        show={showForm ? true : false}
        bottom={300}
      >
        <SubMenu
          name='Edit'
          navigate={false}
          onPress={() =>
            navigation.navigate("editProduct", { edit: true, data: showForm })
          }
          bgColor='#f7d5f6'
          showModal={setShowFrom}
          icon={<Feather name='edit' size={16} color='#d638d2' />}
        />
        <SubMenu
          name='Remove'
          bgColor={color.lightOrange}
          navigate={false}
          showModal={setShowFrom}
          onPress={() => removeProduct(showForm.id, showForm.profile)}
          icon={
            <MaterialCommunityIcons
              name='archive-remove'
              size={18}
              color={color.orange}
            />
          }
        />
      </Drawar>
    </Common>
  );
};

export default ManageProduct;

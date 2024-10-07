import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, View } from "react-native";

import { Common } from "../../components/Common";
import Drawar from "../../components/Drawar";
import SubMenu from "../../components/footer/SubMenu";
import { alert } from "../../components/utilitise/Alert";
import Avater from "../../components/utilitise/Avater";
import Button from "../../components/utilitise/Button";
import { color } from "../../components/utilitise/colors";
import P from "../../components/utilitise/P";
import useStore from "../../context/useStore";
import { styles } from "../../css/manageProduct";
import { Fetch, openNumber } from "../../services/common";

const ManageSupplyer = ({ navigation }) => {
  const [showForm, setShowFrom] = useState(null);
  const [suppliers, setSuppliers] = useState(null);

  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const supplier = await Fetch(store.database.name, "/supplier", "GET");
        setSuppliers(supplier);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    })();
    return () => store.setLoading(false);
  }, [store.updateSupplier]);

  function removeSupplyer(id, profile) {
    alert("Are you sure to remove?", async () => {
      try {
        store.setLoading(true);
        const url = `/supplier?id=${id}&profile=${profile}`;
        const { message } = await Fetch(store.database.name, url, "DELETE");
        store.setMessage({ msg: message, type: "success" });
        store.setUpdateSupplier((prev) => !prev);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
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
              onPress={() => navigation.navigate("addSupplyer")}
              name='pluscircle'
              size={22}
              color='#fff'
            />
          }
        />
      </View>

      <FlatList
        style={{ marginBottom: 57 }}
        data={suppliers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => <View style={{ marginBottom: 6 }} />}
        ListEmptyComponent={() => <P align='center'>no supplier</P>}
        renderItem={({ item }) => (
          <Pressable
            style={styles.itemContainer}
            onPress={() => setShowFrom(item)}
          >
            <View style={{ flexDirection: "row", gap: 7 }}>
              <Avater url={item.profile} />
              <View>
                <P size={15} bold>
                  {item.name}
                </P>
                <P size={13} color='darkGray'>
                  {item.address}
                </P>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    openNumber(item.phone);
                  }}
                >
                  <P color='green' size={13}>
                    {item.phone}
                  </P>
                </Pressable>
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
            navigation.navigate("addSupplyer", { edit: true, data: showForm })
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
          onPress={() => removeSupplyer(showForm.id, showForm.profile)}
          icon={
            <MaterialCommunityIcons
              name='archive-remove'
              size={18}
              color={color.orange}
            />
          }
        />

        <SubMenu
          name='Report'
          navigate={false}
          onPress={() => navigation.navigate("supplyer", { id: showForm.id })}
          bgColor='#d7e5f5'
          showModal={setShowFrom}
          icon={<Octicons name='report' size={16} color='#3b83db' />}
        />
      </Drawar>
    </Common>
  );
};

export default ManageSupplyer;

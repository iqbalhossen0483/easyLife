import { Pressable, Text, View } from "react-native";
import React, { useState } from "react";

import { styles } from "../../css/createOrder";
import BDT from "../utilitise/BDT";
import P from "../utilitise/P";

const Product = ({ products, setForm, production = false }) => {
  const [showDelete, setShowDelete] = useState(-1);

  function deleteProductFromList(item) {
    const id = item.id ? "id" : "productId";
    setForm((prev) => {
      const filtered = prev.products.filter((p) => p[id] !== item[id]);
      prev.products = filtered;
      if (item.id) {
        if (prev.deleteProduct) prev.deleteProduct.push(item.id);
        else prev.deleteProduct = [item.id];
      }
      prev.totalSale = parseFloat(prev.totalSale) - parseFloat(item.total);
      return { ...prev };
    });
    setShowDelete(-1);
  }

  return (
    <View>
      <View style={styles.productTableHeader}>
        <P bold style={{ width: "40%" }}>
          Name
        </P>
        <P align='center' bold style={{ width: "20%" }}>
          Qty
        </P>
        {!production ? (
          <>
            <P align='center' bold style={{ width: "20%" }}>
              Price
            </P>
            <P align='center' bold style={{ width: "20%" }}>
              Total
            </P>
          </>
        ) : null}
      </View>
      {products.map((item, index) => (
        <Pressable
          key={index}
          onLongPress={() => setShowDelete(index)}
          onPress={() => setShowDelete(-1)}
          style={styles.productTableHeader}
        >
          <P style={{ width: "40%" }}>{item.name}</P>
          <P style={{ width: "20%", textAlign: "center" }}>{item.qty}</P>
          {!production ? (
            <>
              <P style={{ width: "20%", textAlign: "center" }}>
                {item.isFree === "false" ? parseFloat(item.price) : "Free"}
              </P>
              <BDT
                style={{ width: "20%", textAlign: "center" }}
                amount={item.total}
              />
            </>
          ) : null}

          {showDelete === index ? (
            <View style={styles.deleteBtn}>
              <Pressable onPress={() => deleteProductFromList(item)}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
};

export default Product;

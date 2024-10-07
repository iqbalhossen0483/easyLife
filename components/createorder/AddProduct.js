import React, { useState } from "react";
import { Alert, TextInput } from "react-native";

import { commonStyles } from "../../css/common";
import Drawar from "../Drawar";
import Button from "../utilitise/Button";
import P from "../utilitise/P";
import Select from "../utilitise/Select";
import FreeProduct from "./FreeProduct";

const AddProduct = ({ show, setForm, setShow, products }) => {
  const [product, setProduct] = useState({ isFree: "false" });

  function addToListProduct() {
    if (product.isFree === "false") {
      const exist = products.find((p) => p.productId === product.productId);
      if (exist) return Alert.alert("Alrady added");
    }
    setForm((prev) => {
      if (!product.qty) product.qty = 1;
      if (product.isFree === "false") {
        product.total = Math.floor(product.qty * product.price);
        prev.totalSale += product.total;
      }
      prev.products.push(product);
      return { ...prev };
    });
    setProduct({ isFree: "false" });
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
        Add a product
      </P>
      <Select
        placeholder='Select Product'
        url='/product?opt=id,name,price,stock'
        header='name'
        search={true}
        height='auto'
        handler={(_, info) =>
          setProduct({
            productId: info.id,
            name: info.name,
            price: info.price,
            isFree: "false",
            stock: info.stock,
          })
        }
      />

      <TextInput
        style={commonStyles.input}
        placeholder='Qty'
        keyboardType='phone-pad'
        defaultValue={product.name ? "1" : ""}
        onChangeText={(value) =>
          setProduct((prev) => {
            return { ...prev, qty: value };
          })
        }
      />
      <TextInput
        style={commonStyles.input}
        placeholder='Price'
        keyboardType='phone-pad'
        defaultValue={product.price?.toString()}
        onChangeText={(value) =>
          setProduct((prev) => {
            return { ...prev, price: value };
          })
        }
      />

      {/* in case of Free product */}
      {product.productId && !product.id ? (
        <FreeProduct product={product} setProduct={setProduct} />
      ) : null}

      <Button
        style={{ marginTop: 5 }}
        disabled={!product.name}
        title='Add'
        onPress={addToListProduct}
      />
    </Drawar>
  );
};

export default AddProduct;

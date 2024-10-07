import Checkbox from "expo-checkbox";
import React from "react";
import { TextInput, View } from "react-native";

import { commonStyles } from "../../css/common";
import P from "../utilitise/P";

const PreviousOrder = ({ form, setForm }) => {
  return (
    <>
      {form.prevSale ? (
        <TextInput
          onChangeText={(value) =>
            setForm((prev) => {
              return { ...prev, totalSale: value };
            })
          }
          keyboardType='phone-pad'
          defaultValue={form.totalSale?.toString()}
          style={commonStyles.input}
          placeholder='Sold amount $'
        />
      ) : null}
      <View
        style={{
          flexDirection: "row",
          columnGap: 4,
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Checkbox
          value={form.prevSale}
          style={{ width: 15, height: 15 }}
          color={form.prevSale ? "green" : "gray"}
          onValueChange={() =>
            setForm((prev) => {
              return { ...prev, prevSale: !prev.prevSale };
            })
          }
        />
        <P size={15}>Previous sold order?</P>
      </View>
    </>
  );
};

export default PreviousOrder;

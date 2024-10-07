import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

import { commonStyles } from "../../css/common";
import { styles } from "../../css/orderDetails";
import { dateFormatter } from "../../services/common";
import BDT from "../utilitise/BDT";
import P from "../utilitise/P";

const SeeCollectionList = ({ setShow, data }) => {
  const tablerowStyle = { width: "30%", textAlign: "center" };
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

      <View style={commonStyles.tableRow}>
        <P bold style={tablerowStyle}>
          Received
        </P>
        <P bold style={tablerowStyle}>
          Amount
        </P>
        <P bold style={tablerowStyle}>
          Date
        </P>
      </View>
      {data.map((item) => (
        <View
          style={{ ...commonStyles.tableRow, borderTopWidth: 0 }}
          key={item.id}
        >
          <P style={tablerowStyle}>{item.name}</P>
          <P style={tablerowStyle}>
            <BDT amount={item.amount} />
          </P>
          <P style={tablerowStyle}>{dateFormatter(item.date)}</P>
        </View>
      ))}
    </View>
  );
};

export default SeeCollectionList;

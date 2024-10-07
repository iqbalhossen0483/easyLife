import {
  TouchableHighlight,
  Pressable,
  TextInput,
  Text,
  View,
} from "react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

import { commonStyles } from "../css/common";
import { color } from "./utilitise/colors";
import P from "./utilitise/P";

const SearchFilter = ({
  filter = true,
  placeholder,
  searchfeild = true,
  orderPage = false,
  search,
}) => {
  const [fromDate, setFromDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [dofilter, seDotFilter] = useState(false);
  const [highlight, setHighlight] = useState(1);
  const [inptVlue, setInputvalue] = useState("");

  const showDatepicker = (setDate, fn) => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        if (fn !== undefined) fn(currentDate);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  function serchDate(date) {
    search(
      `search=${inptVlue}&from=${fromDate.toISOString()}&end=${date.toISOString()}`
    );
  }
  function searchInput() {
    search(`search=${inptVlue}`);
  }

  const iconcss = {
    borderRadius: 50,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 7,
        flexDirection: "row",
        justifyContent: filter ? "space-between" : "center",
        alignItems: "center",
        borderBottomColor: color.gray,
        borderBottomWidth: 0.4,
      }}
    >
      {searchfeild ? (
        <View style={{ position: "relative", width: 200 }}>
          <TextInput
            onChangeText={(value) => setInputvalue(value)}
            placeholder={placeholder || "Search"}
            style={commonStyles.input}
          />
          <TouchableHighlight
            underlayColor={color.gray}
            onPress={searchInput}
            style={{
              borderBottomRightRadius: 5,
              borderTopRightRadius: 5,
              position: "absolute",
              height: "100%",
              right: 0,
              width: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name='search-sharp' size={24} color={color.darkGray} />
          </TouchableHighlight>
        </View>
      ) : null}

      <View style={{ flexDirection: "row", gap: 20 }}>
        {orderPage && !dofilter ? (
          <>
            <Pressable
              onPress={() => {
                orderPage.seeAll();
                setHighlight(1);
              }}
              style={{
                ...iconcss,
                backgroundColor: highlight === 1 ? color.green : color.gray,
              }}
            >
              <P bold color={highlight === 1 ? "light" : "black"}>
                All
              </P>
            </Pressable>

            <Pressable
              onPress={() => {
                orderPage.initCollSearch(`search=${inptVlue}`);
                setHighlight(2);
              }}
              style={{
                ...iconcss,
                backgroundColor: highlight === 2 ? color.green : color.gray,
              }}
            >
              <FontAwesome6
                name='circle-dollar-to-slot'
                size={20}
                color={highlight === 2 ? "white" : "gray"}
              />
            </Pressable>
          </>
        ) : null}

        {filter ? (
          <View>
            {!dofilter ? (
              <Pressable onPress={() => seDotFilter(true)}>
                {orderPage ? (
                  <View style={iconcss}>
                    <FontAwesome name='filter' size={20} color='gray' />
                  </View>
                ) : (
                  <P size={13} align='center' bold color='darkGray'>
                    Filter
                  </P>
                )}
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  seDotFilter(false);
                  search("");
                }}
              >
                <P size={13} align='center' bold color='darkGray'>
                  Reset
                </P>
              </Pressable>
            )}
            {dofilter ? (
              <View style={{ flexDirection: "row", gap: 10, marginTop: -5 }}>
                <Pressable onPress={() => showDatepicker(setFromDate)}>
                  <P bold align='center'>
                    From
                  </P>
                  <Text>{fromDate.toLocaleDateString("en-GB")}</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    showDatepicker(setendDate, serchDate);
                  }}
                >
                  <P bold align='center'>
                    End
                  </P>
                  <P>{endDate.toLocaleDateString("en-GB")}</P>
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default SearchFilter;

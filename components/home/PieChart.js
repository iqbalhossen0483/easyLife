import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { PieChart } from "react-native-chart-kit";
import useStore from "../../context/useStore";
import { Fetch } from "../../services/common";
import Button from "../utilitise/Button";
import Select from "../utilitise/Select";
import { color } from "../utilitise/colors";

const PieChartData = () => {
  const [data, setData] = useState(null);
  const [methods, setMethods] = useState("Month");
  const [date, setDate] = useState({
    month: new Date().toLocaleString("en-us", { month: "long" }),
    year: new Date().getFullYear(),
    date: new Date(),
  });
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await Fetch(
          store.database.name,
          `/admin/pichartdata?date=${date.date}&method=${methods}`,
          "GET"
        );
        setData(res[0]);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      }
    })();
  }, [date]);

  if (!data?.opening) return null;

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date.date || new Date(),
      onChange: (event, selectedDate) => {
        setDate({
          month: selectedDate.toLocaleString("en-us", { month: "long" }),
          year: selectedDate.getFullYear(),
          date: selectedDate,
        });
      },
      mode: "date",
    });
  };

  const payload = [
    {
      name: "Opening Cash",
      amount: parseInt(data.opening),
      color: "#AADEA7",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
    {
      name: "Total Sale",
      amount: parseInt(data.totalSale),
      color: "#64C2A6",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
    {
      name: "Due Sale",
      amount: parseInt(data.dueSale),
      color: "#FEAE65",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
    {
      name: "Collection",
      amount: parseInt(data.collection),
      color: "#E6F69D",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
    {
      name: "Expense",
      amount: parseInt(data.expense),
      color: "#F66D44",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
    {
      name: "Purchase",
      amount: parseInt(data.purchase),
      color: "#2D87BB",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
    {
      name: "Market Due",
      amount: parseInt(data.dueSale) - parseInt(data.collection) || 0,
      color: "#cc5531",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
    {
      name: "Closing",
      amount: parseInt(data.closing),
      color: "#7e29d9",
      legendFontColor: color.darkGray,
      legendFontSize: 15,
    },
  ];

  return (
    <View style={{ marginBottom: 15 }}>
      <PieChart
        data={payload}
        width={Dimensions.get("screen").width}
        height={250}
        chartConfig={{ color: () => color.green }}
        accessor={"amount"}
        backgroundColor={color.light}
        center={[20, 10]}
      />

      <View
        style={{
          width: "90%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignSelf: "center",
        }}
      >
        <Button
          onPress={showDatepicker}
          style={{ width: "60%" }}
          title='Be Specific'
        />
        <View style={{ width: "35%" }}>
          <Select
            defaultValue={methods.name}
            header='name'
            name='method'
            top={true}
            editable={false}
            placeholder='Month'
            height={140}
            options={[{ name: "Month" }, { name: "Year" }]}
            handler={(_, info) => setMethods(info.name)}
          />
        </View>
      </View>
    </View>
  );
};

export default PieChartData;

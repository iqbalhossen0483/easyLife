import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import useStore from "../../context/useStore";
import { commonStyles } from "../../css/common";
import { Fetch } from "../../services/common";
import Button from "../utilitise/Button";
import { color } from "../utilitise/colors";
import P from "../utilitise/P";
import Select from "../utilitise/Select";

const StockChart = () => {
  const [methods, setMethods] = useState("Month");
  const [data, setData] = useState(null);
  const currentDate = new Date();
  const [date, setDate] = useState({
    month: currentDate.toLocaleString("en-us", { month: "long" }),
    year: currentDate.getFullYear(),
    date: currentDate,
  });
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await Fetch(
          store.database.name,
          `/admin/productchartdata?date=${date.date}&method=${methods}`,
          "GET"
        );
        setData(res);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      }
    })();
  }, [date]);

  if (!data?.length) return null;

  const payload = {
    legend: [`Stock Report of ${methods === "Month" ? date.month : date.year}`],
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.totalSold),
        color: () => color.green,
        strokeWidth: 2,
      },
    ],
  };

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

  return (
    <View style={{ marginTop: 10, paddingHorizontal: 10, marginBottom: 15 }}>
      <P bold style={{ ...commonStyles.heading, width: "100%", marginTop: 0 }}>
        Stock Overview
      </P>
      <ScrollView horizontal={true} style={{ marginBottom: 5 }}>
        <LineChart
          data={payload}
          height={300}
          width={700}
          yAxisSuffix=' P'
          bezier
          verticalLabelRotation={90}
          chartConfig={{
            color: () => color.green,
            barPercentage: 0.5,
            backgroundGradientFrom: "#edeef5",
            backgroundGradientTo: "#edeef5",
            decimalPlaces: 0,
          }}
        />
      </ScrollView>

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

export default StockChart;

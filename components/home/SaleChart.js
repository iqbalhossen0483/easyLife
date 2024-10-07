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

const SaleChart = () => {
  const [methods, setMethods] = useState("Month");
  const [highlight, setHighlight] = useState(0);
  const [data, setData] = useState(null);
  const [colm, setColm] = useState({ name: "Total Sales", url: "totalSale" });
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
          `/admin/chartdata?date=${date.date}&method=${methods}`,
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
    legend: [
      `${colm.name} Report of ${methods === "Month" ? date.month : date.year}`,
    ],
    datasets: [
      {
        data: data.map((item) => item[colm.url]),
        color: () => color.green,
        strokeWidth: 2,
      },
    ],
  };
  if (methods === "Month") {
    payload.labels = data.map((item) => new Date(item.date).getDate() || "");
  } else {
    payload.labels = data.map((item) => item.month || "");
  }

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

  const btns = [
    { name: "Total Sales", url: "totalSale" },
    { name: "Due Sales", url: "dueSale" },
    { name: "Collection", url: "collection" },
    { name: "Expense", url: "expense" },
    { name: "Market Due", url: "marketDue" },
  ];
  return (
    <View style={{ marginTop: 10, paddingHorizontal: 10 }}>
      <P bold style={{ ...commonStyles.heading, width: "100%", marginTop: 0 }}>
        Sales Overview
      </P>
      <ScrollView horizontal={true} style={{ marginBottom: 5 }}>
        <LineChart
          data={payload}
          height={300}
          width={700}
          yAxisSuffix='৳'
          bezier
          verticalLabelRotation={0}
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
      <ScrollView horizontal={true}>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            gap: 5,
          }}
        >
          {btns.map((btn, i) => (
            <Button
              variant={highlight !== i && "normal"}
              key={i}
              title={btn.name}
              onPress={() => {
                setHighlight(i);
                setColm(btn);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SaleChart;

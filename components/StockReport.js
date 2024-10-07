import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { View } from "react-native";

import useStore from "../context/useStore";
import { commonStyles } from "../css/common";
import { style } from "../css/home";
import { Fetch } from "../services/common";
import { modifyStockReport } from "../services/report";
import BDT from "./utilitise/BDT";
import Button from "./utilitise/Button";
import { color } from "./utilitise/colors";
import { LoadingOnComponent } from "./utilitise/Loading";
import P from "./utilitise/P";
import Select from "./utilitise/Select";

const StockReport = ({ data }) => {
  const [date, setDate] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [methods, setMethods] = useState({ name: "Days" });
  const store = useStore();

  const showDatepicker = () => {
    DateTimePickerAndroid.open({
      value: date || new Date(),
      onChange: (event, selectedDate) => {
        const currentDate = selectedDate;
        if (methods.name === "Clear") setMethods({ name: "Days" });
        setDate(currentDate);
      },
      mode: "date",
      is24Hour: true,
    });
  };

  useEffect(() => {
    const modified = modifyStockReport(data.products, data.stockReport);
    setReport(modified);
  }, [data]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const method = methods.name;
        if (method === "Clear") return;
        let base = "/admin?stockReport=true&";
        const url =
          method === "Days"
            ? (base += `method=date&date=${date.toISOString()}`)
            : method === "Month"
            ? (base += `method=month&date=${date.toLocaleString("en-us", {
                month: "long",
              })}&year=${date.getFullYear()}`)
            : (base += `method=year&date=${date.getFullYear()}`);

        const report = await Fetch(store.database.name, url, "GET");
        setReport(report);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        setLoading(false);
      }
    }
    if (date) fetchData();
  }, [date]);

  useEffect(() => {
    if (methods.name === "Clear") {
      const modified = modifyStockReport(data.products, data.stockReport);
      setReport(modified);
      setDate(null);
    }
  }, [methods.name]);

  const rowStyles = (type) => {
    return {
      width: "20%",
      textAlign: "center",
      borderRightWidth: 1,
      borderRightColor: color.gray,
      paddingVertical: 5,
      color: /Normal|Main/.test(type)
        ? color.lightBlue
        : type === "raw"
        ? color.green
        : color.black,
    };
  };
  const row = {
    width: "20%",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: color.gray,
    paddingVertical: 5,
  };
  return (
    <View style={{ ...style.totalReportContainer, marginBottom: 10 }}>
      <P bold style={{ ...commonStyles.heading, width: "100%", marginTop: 0 }}>
        Stock Report Of {"\n"}
        <P size={15} style={{ color: "#8f1391" }}>
          {date ? prittyDate(date, methods) : prittyDate(new Date(), methods)}
        </P>
      </P>

      <View style={{ width: "100%" }}>
        <View
          style={{
            ...commonStyles.tableRow,
            paddingHorizontal: 0,
            paddingVertical: 0,
          }}
        >
          <P style={row}>Name</P>
          <P style={row}>Previous</P>
          <View style={row}>
            {store.database.production ? (
              <View>
                <P align='center' color='lightBlue'>
                  Purchase
                </P>
                <P align='center' color='green' size={13}>
                  Production
                </P>
              </View>
            ) : (
              <P align='center'>Purchase</P>
            )}
          </View>
          <View style={row}>
            {store.database.production ? (
              <View>
                <P align='center' color='lightBlue'>
                  Sales
                </P>
                <P align='center' color='green' size={13}>
                  Production
                </P>
              </View>
            ) : (
              <P align='center'>Sales</P>
            )}
          </View>
          <P style={{ ...row, borderRightWidth: 0 }}>Remain</P>
        </View>
        {report && report.length ? (
          report.map((item, i) => {
            const styl = rowStyles(item.type);
            return (
              <View
                style={{
                  ...commonStyles.tableRow,
                  borderTopWidth: 0,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                }}
                key={i}
              >
                <P style={row}>{item.name}</P>
                <BDT bdtSign={false} style={row} amount={item.previousStock} />
                <BDT bdtSign={false} style={styl} amount={item.purchased} />
                <BDT bdtSign={false} style={styl} amount={item.totalSold} />
                <BDT
                  bdtSign={false}
                  style={{ ...row, borderRightWidth: 0 }}
                  amount={item.remainingStock}
                />
              </View>
            );
          })
        ) : (
          <P align='center'>No sales</P>
        )}
      </View>

      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <Button
          onPress={showDatepicker}
          style={{ width: "70%" }}
          title='Be Specific'
        />
        <View style={{ width: "25%" }}>
          <Select
            defaultValue={methods.name}
            header='name'
            name='method'
            top={true}
            editable={false}
            placeholder='Select method'
            height={140}
            options={[
              { name: "Days" },
              { name: "Month" },
              { name: "Year" },
              { name: "Clear" },
            ]}
            handler={(_, info) => setMethods(info)}
          />
        </View>
      </View>
      {loading ? <LoadingOnComponent /> : null}
    </View>
  );
};

export default StockReport;

function prittyDate(date, method) {
  if (method.name === "Month") {
    return (
      date.toLocaleDateString("en-GB", { month: "long" }) +
      " " +
      date.getFullYear()
    );
  } else if (method.name === "Year") {
    return date.getFullYear();
  }
  return date.toLocaleDateString("en-GB");
}

import { useEffect, useState } from "react";
import { ScrollView } from "react-native";

import { Common } from "../../components/Common";
import Account from "../../components/home/Account";
import CashReport from "../../components/home/CashReport";
import PieChartData from "../../components/home/PieChart";
import SaleChart from "../../components/home/SaleChart";
import StockChart from "../../components/home/StockChart";
import StockReport from "../../components/StockReport";
import Splash from "../../components/utilitise/Splash";
import useStore from "../../context/useStore";
import { Fetch, role } from "../../services/common";
import { modifyCashReport } from "../../services/report";

const Home = ({ navigation }) => {
  const [data, setData] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        store.setShowSplash(true);
        const data = await Fetch(store.database.name, "/admin", "GET");
        setData(data);
      } catch (error) {
        navigation.navigate("error");
      } finally {
        store.setShowSplash(false);
      }
    })();
  }, [store.updateReport]);

  if (store.showSplash) return <Splash />;

  if (!data) return null;
  return (
    <Common>
      <ScrollView style={{ marginBottom: 57 }}>
        {store.user.designation === role.admin ? (
          <>
            <CashReport data={modifyCashReport(data.cashReport)} />
            <Account users={data.users} />
          </>
        ) : null}
        <StockReport
          data={{ products: data.products, stockReport: data.stockReport }}
        />
        {store.user.designation === role.admin ? (
          <>
            <SaleChart />
            <PieChartData />
            <StockChart />
          </>
        ) : null}
      </ScrollView>
    </Common>
  );
};

export default Home;

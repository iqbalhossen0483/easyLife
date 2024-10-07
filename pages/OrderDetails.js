import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { Common } from "../components/Common";
import CollectionForm from "../components/order/CollectionForm";
import SeeCollectionList from "../components/order/SeeCollectionList";
import BDT from "../components/utilitise/BDT";
import Button from "../components/utilitise/Button";
import { color } from "../components/utilitise/colors";
import P from "../components/utilitise/P";
import useStore from "../context/useStore";
import { commonStyles } from "../css/common";
import { styles } from "../css/orderDetails";
import { Fetch, dateFormatter } from "../services/common";

const OrderDetails = ({ route }) => {
  const [showCollnForm, setShowCollForm] = useState(false);
  const [showCollInfo, setShowCollInfo] = useState(false);
  const [data, setData] = useState(null);
  const store = useStore();

  useEffect(() => {
    (async () => {
      try {
        store.setLoading(true);
        const result = await Fetch(
          store.database.name,
          `/order?id=${route.params?.id}`,
          "GET"
        );
        setData(result);
      } catch (error) {
        store.setMessage({ msg: error.message, type: "error" });
      } finally {
        store.setLoading(false);
      }
    })();
  }, [route.params?.id, store.updateOrder]);

  if (!data) return null;
  return (
    <Common>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <P align='center' bold size={18} style={{ color: color.light }}>
            {store?.database?.title}
          </P>
          <P align='center' size={13} style={{ color: color.light }}>
            {store?.database?.address}
          </P>
        </View>
        <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
          <ShopDetails data={data} />
          <Products
            data={data}
            setShowCollForm={setShowCollForm}
            setShowCollInfo={setShowCollInfo}
          />
        </View>

        {showCollnForm && (
          <CollectionForm data={data} setShow={setShowCollForm} />
        )}
        {showCollInfo && (
          <SeeCollectionList
            data={data.collections}
            setShow={setShowCollInfo}
          />
        )}
      </View>
    </Common>
  );
};

function ShopDetails({ data }) {
  return (
    <>
      <View style={styles.dateNbill}>
        <P>
          <P size={13} bold>
            Bill No:
          </P>{" "}
          {data.billno}
        </P>
        <P>
          <P size={13} bold>
            Date:{" "}
          </P>
          {dateFormatter(data.date)}
        </P>
      </View>

      <View style={{ flexDirection: "row", columnGap: 5, marginTop: 5 }}>
        <P size={13} bold>
          Name:
        </P>
        <P style={styles.shopNameNaddress}>{data.shopName}</P>
      </View>
      <View style={{ flexDirection: "row", columnGap: 5 }}>
        <P size={13} bold>
          Address:
        </P>
        <P style={styles.shopNameNaddress}>{data.address}</P>
      </View>
    </>
  );
}

function Products({ data, setShowCollForm, setShowCollInfo }) {
  const rowstyles = { width: "25%" };
  return (
    <View style={styles.detailsWrapper}>
      <View style={commonStyles.tableRow}>
        <P align='center' bold style={rowstyles}>
          Product
        </P>
        <P align='center' bold style={rowstyles}>
          Qty
        </P>
        <P align='center' bold style={rowstyles}>
          Price
        </P>
        <P align='center' bold style={rowstyles}>
          Total
        </P>
      </View>
      {data.products?.length ? (
        data.products.map((item) => (
          <View
            key={item.id}
            style={{ ...commonStyles.tableRow, borderTopWidth: 0 }}
          >
            <P align='center' style={rowstyles}>
              {item?.name}
            </P>
            <P align='center' style={rowstyles}>
              {parseFloat(item.qty)}
            </P>
            <P align='center' style={rowstyles}>
              {parseFloat(item.price)}
            </P>
            <BDT
              style={{ width: "25%", textAlign: "center" }}
              amount={item.total}
            />
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center" }}>No product</Text>
      )}
      <View
        style={{
          marginTop: 10,
          alignItems: "flex-end",
          paddingHorizontal: 6,
        }}
      >
        <BottomPart data={data} />

        {data.due !== 0 && (
          <Button
            onPress={() => setShowCollForm(true)}
            style={{ marginVertical: 5 }}
            title='Get Collection'
          />
        )}
        {data.collections?.length !== 0 && (
          <Button
            onPress={() => setShowCollInfo(true)}
            title='See Collection Info'
          />
        )}
      </View>
    </View>
  );
}

function BottomPart({ data }) {
  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ gap: 5 }}>
        <P
          bold
          style={{
            borderBottomWidth: 1,
            borderColor: color.gray,
            paddingEnd: 5,
          }}
        >
          Total:
        </P>
        <P
          bold
          style={{
            borderBottomWidth: 1,
            borderColor: color.gray,
            paddingEnd: 5,
          }}
        >
          Payment:
        </P>
        <P
          bold
          style={{
            borderBottomWidth: 1,
            borderColor: color.gray,
            paddingEnd: 5,
            color: data.due ? "#dc2626" : "#000",
          }}
        >
          Due:
        </P>
      </View>
      <View style={{ gap: 5 }}>
        <BDT
          style={{ borderBottomWidth: 1, borderColor: color.gray }}
          amount={data.totalSale}
        />
        <BDT
          style={{ borderBottomWidth: 1, borderColor: color.gray }}
          amount={data.payment}
        />
        <BDT
          style={{
            borderBottomWidth: 1,
            borderColor: color.gray,
            color: data.due ? "#dc2626" : "#000",
          }}
          amount={data.due}
        />
      </View>
    </View>
  );
}

export default OrderDetails;

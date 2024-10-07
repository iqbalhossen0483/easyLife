import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { IOScrollView, InView } from "react-native-intersection-observer";

import { Common } from "../components/Common";
import SearchFilter from "../components/SearchFilter";
import BDT from "../components/utilitise/BDT";
import Button from "../components/utilitise/Button";
import { color } from "../components/utilitise/colors";
import P from "../components/utilitise/P";
import useStore from "../context/useStore";
import { styles } from "../css/customer";
import { Fetch, dateFormatter, notify } from "../services/common";

const ExpenseReport = () => {
  const [expense, setExpense] = useState({});
  const [page, setPage] = useState(0);
  const store = useStore();
  const [searchVlue, setSearchvalue] = useState("");

  useEffect(() => {
    if (searchVlue) search(searchVlue);
    else {
      const url =
        store.user.designation === "Admin"
          ? `/expense?page=${page}`
          : `/expense?page=${page}&user_id=${store.user.id}`;
      fetchData(url);
    }
    return () => store.setLoading(false);
  }, [store.updateExpense, page]);

  async function fetchData(url) {
    try {
      store.setLoading(true);
      setSearchvalue("");

      const res = await Fetch(store.database.name, url, "GET");
      if (page) {
        setExpense({
          count: res.count || 0,
          pendingExpense: res.pendingExpense,
          data: [...expense.data, ...res.data],
        });
      } else if (res.type) {
        setExpense({
          count: res.data.length || 0,
          pendingExpense: res.pendingExpense,
          data: res.data,
          type: res.type,
        });
      } else {
        setExpense(res);
      }
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  async function achievedReq(data) {
    try {
      store.setLoading(true);
      const result = await Fetch(
        store.database.name,
        "/expense/achieve",
        "POST",
        data
      );
      store.setMessage({ msg: result.message, type: "success" });
      store.setUpdateUser((prev) => !prev);
      store.setUpdateReport((prev) => !prev);
      store.setUpdateExpense((prev) => !prev);
      await notify(
        store.database.name,
        "Expense Accepted",
        `Your axpense request accepted by ${store.user.name}`,
        { type: "expense_req_accepted", toUser: data.created_by }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  async function decline(id, created_by) {
    try {
      store.setLoading(true);
      const result = await Fetch(
        store.database.name,
        `/expense?id=${id}`,
        "DELETE"
      );
      store.setMessage({ msg: result.message, type: "success" });
      store.setUpdateExpense((prev) => !prev);

      await notify(
        store.database.name,
        "Expense Declined",
        `Your expense request declined by ${store.user.name}`,
        { type: "expense_req_decline", toUser: created_by }
      );
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  async function search(value, initPage) {
    try {
      store.setLoading(true);

      const res = await Fetch(
        store.database.name,
        `/expense?${value}&page=${initPage ? 0 : page}`,
        "GET"
      );
      if (!initPage && page)
        setExpense({ count: res.count, data: [...expense.data, ...res.data] });
      else setExpense(res);
      setSearchvalue(value);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  function initSearch(value) {
    setPage(0);
    let txt = value;
    if (store.user.designation !== "Admin") {
      if (!txt) txt = `user_id=${store.user.id}`;
      else txt = value.replace("search=", `search=${store.user.name}`);
    }
    search(txt, true);
  }

  return (
    <Common>
      <IOScrollView style={{ marginBottom: 57 }}>
        <SearchFilter
          placeholder='Name Or type'
          searchfeild={store.user.designation === "Admin" ? true : false}
          search={initSearch}
        />
        {store.user.designation === "Admin" ? (
          <View>
            {expense?.type === "pending" ? (
              <Pressable onPress={() => fetchData("/expense?page=0")}>
                <P size={15} bold>
                  See all expense reports
                </P>
              </Pressable>
            ) : (
              <Pressable onPress={() => fetchData(`/expense?pending=true`)}>
                <P size={15} bold>
                  Pending Request: {expense.pendingExpense || 0}
                  <P color='orange'> Check it</P>
                </P>
              </Pressable>
            )}
          </View>
        ) : null}

        {!store.loading && expense?.count ? (
          <View style={{ marginVertical: 4 }}>
            <P size={13}>
              Showing Result {expense?.data?.length} Of {expense?.count}
            </P>
          </View>
        ) : null}

        {expense?.data?.length ? (
          expense.data.map((item, i, arr) => (
            <InView
              key={item.id}
              style={styles.container}
              onChange={() => {
                if (
                  expense?.count &&
                  expense?.count !== expense?.data?.length &&
                  i === arr.length - 1
                ) {
                  setPage((prev) => prev + 1);
                }
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{ marginLeft: 6 }}>
                    <P>
                      Expense For: <P bold>{item.type}</P>
                    </P>
                    <P>
                      Expense Amount: <BDT amount={item.amount} />
                    </P>
                  </View>
                </View>
                <View>
                  <P>
                    Expense By: <P bold>{item.userName}</P>
                  </P>
                  <P color='darkGray' size={13} style={{ marginTop: 3 }}>
                    Date:
                    {dateFormatter(item.date)}
                  </P>
                </View>
              </View>
              {expense?.type === "pending" ? (
                <View
                  style={{
                    flexDirection: "row",
                    gap: 3,
                    justifyContent: "center",
                  }}
                >
                  <Button
                    disabled={store.loading}
                    onPress={() => achievedReq(item)}
                    style={{
                      backgroundColor: color.green,
                      paddingVertical: 3,
                      marginTop: 3,
                    }}
                    title='Achieve'
                  />
                  <Button
                    disabled={store.loading}
                    onPress={() => decline(item.id, item.created_by)}
                    style={{
                      backgroundColor: color.orange,
                      paddingVertical: 3,
                      marginTop: 3,
                    }}
                    title='Decline'
                  />
                </View>
              ) : null}
            </InView>
          ))
        ) : (
          <P align='center'>No Expense Report</P>
        )}
      </IOScrollView>
    </Common>
  );
};

export default ExpenseReport;

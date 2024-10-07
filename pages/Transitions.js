import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { IOScrollView, InView } from "react-native-intersection-observer";

import { Common } from "../components/Common";
import SearchFilter from "../components/SearchFilter";
import BDT from "../components/utilitise/BDT";
import { color } from "../components/utilitise/colors";
import P from "../components/utilitise/P";
import useStore from "../context/useStore";
import { Fetch, dateFormatter } from "../services/common";

const Transitions = () => {
  const [transitions, setTransition] = useState(null);
  const [searchValue, setSearchvalue] = useState("");
  const [page, setPage] = useState(0);
  const store = useStore();

  useEffect(() => {
    if (searchValue) search(searchValue);
    else {
      (async () => {
        try {
          store.setLoading(true);
          setSearchvalue("");

          const url =
            store.user.designation === "Admin"
              ? `/admin/transitions?page=${page}`
              : `/admin/transitions?user_id=${store.user.id}&page=${page}`;

          const res = await Fetch(store.database.name, url, "GET");
          if (page) {
            setTransition({
              count: res.count,
              data: [...transitions.data, ...res.data],
            });
          } else setTransition(res);
        } catch (error) {
          setMessage({ msg: error.message, type: "error" });
        } finally {
          store.setLoading(false);
        }
      })();
    }

    return () => store.setLoading(false);
  }, [page]);

  async function search(query, initPage) {
    try {
      store.setLoading(true);

      const res = await Fetch(
        store.database.name,
        `/admin/transitions?${query}&page=${initPage ? 0 : page}`,
        "GET"
      );

      if (!initPage && page) {
        setTransition({
          count: res.count,
          data: [...transitions.data, ...res.data],
        });
      } else setTransition(res);
      setSearchvalue(query);
    } catch (error) {
      store.setMessage({ msg: error.message, type: "error" });
    } finally {
      store.setLoading(false);
    }
  }

  function initSearch(value) {
    setPage(0);
    const url =
      store.user.designation === "Admin"
        ? value
        : value + `&user_id=${store.user.id}`;
    search(url, true);
  }

  return (
    <Common>
      <IOScrollView style={{ marginBottom: 59 }}>
        <SearchFilter
          searchfeild={store.user.designation === "Admin" ? true : false}
          placeholder='To user Or From user'
          search={initSearch}
        />
        {!store.loading ? (
          <View style={{ marginVertical: 4, marginLeft: 8 }}>
            <P size={13}>
              Showing Result {transitions?.data?.length} Of {transitions?.count}
            </P>
          </View>
        ) : null}

        {transitions?.data?.length ? (
          transitions.data.map((item, i, arr) => (
            <InView
              onChange={() => {
                if (
                  transitions?.count &&
                  transitions?.count !== transitions?.data?.length &&
                  i === arr.length - 1
                ) {
                  setPage((prev) => prev + 1);
                }
              }}
              style={{
                backgroundColor: "#fff",
                borderBottomColor: color.gray,
                borderBottomWidth: 1,
                padding: 8,
              }}
              key={item.id}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <P>From: {item.fromUserName}</P>
                  <P>To: {item.toUserName || item.toSuppilerName}</P>
                  <P>Purpose: {item.purpose}</P>
                </View>
                <View>
                  <P>
                    Amount: <BDT amount={item.amount} />
                  </P>
                  <P>Date: {dateFormatter(item.date)}</P>
                </View>
              </View>
              <P>
                <P bold>Note:</P> {item.notes || "N/A"}
              </P>
            </InView>
          ))
        ) : (
          <P align='center'>No Transitions found</P>
        )}
      </IOScrollView>
    </Common>
  );
};

export default Transitions;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import { usePushNotifications } from "./usepushNotification";
import { Fetch } from "../services/common";

const Store = () => {
  const [updatePurchase, setUpdatePurchase] = useState(false);
  const [updateCustomer, setUpdateCustomer] = useState(false);
  const [updateSupplier, setUpdateSupplier] = useState(false);
  const [upNotification, setUpNotification] = useState(false);
  const [updateExpense, setUpdateExpense] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(false);
  const [updateReport, setUpdateReport] = useState(false);
  const [updateOrder, setUpdateOrder] = useState(false);
  const [updateNote, setUpdateNotes] = useState(false);
  const [updateUser, setUpdateUser] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [database, setDatabase] = useState(null);
  const [showSplash, setShowSplash] = useState(false);
  const [user, setUser] = useState(null);
  const { expoPushToken } = usePushNotifications();
  const [message, setMessage] = useState({
    msg: "",
    type: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) throw { message: "Login faild" };
        const res = await Fetch("login", `/login?token=${token}`, "GET");
        setDatabase(res.database);
        setUser(res.user);
      } catch (error) {
        setUser(null);
        await AsyncStorage.removeItem("token");
        setMessage({ msg: error.message, type: "error" });
      } finally {
        setUserLoading(false);
      }
    })();
  }, [updateUser]);

  useEffect(() => {
    if (user && database && expoPushToken) {
      (async () => {
        try {
          await Fetch(database.name, "/user?token=true", "PUT", {
            pushToken: expoPushToken.data,
            id: user.id,
          });
          setUser((prev) => {
            return { ...prev, pushToken: expoPushToken };
          });
        } catch (error) {
          setMessage({ msg: error.message, type: "error" });
        }
      })();
    }
  }, [database, user?.id, expoPushToken]);

  return {
    message,
    setMessage,
    loading,
    setLoading,
    user,
    setUser,
    userLoading,
    updateUser,
    setUpdateUser,
    updateCustomer,
    setUpdateCustomer,
    updateNote,
    setUpdateNotes,
    updateProduct,
    setUpdateProduct,
    updateSupplier,
    setUpdateSupplier,
    updateOrder,
    setUpdateOrder,
    updateReport,
    setUpdateReport,
    upNotification,
    setUpNotification,
    updateExpense,
    setUpdateExpense,
    updatePurchase,
    setUpdatePurchase,
    showSplash,
    setDatabase,
    database,
    setShowSplash,
  };
};

export default Store;

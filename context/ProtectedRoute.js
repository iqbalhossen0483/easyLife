import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import useStore from "./useStore";
import { LoadingOnComponent } from "../components/utilitise/Loading";

const ProtecteApp = ({ children }) => {
  const navigation = useNavigation();
  const store = useStore();

  useEffect(() => {
    if (!store.userLoading && !store.user) {
      navigation.navigate("/login");
    }
  }, [store.user]);

  if (store?.userLoading) return <LoadingOnComponent />;
  return children;
};

export default ProtecteApp;

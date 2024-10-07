import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { Suspense, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { color } from "../components/utilitise/colors";
import { usePushNotifications } from "../context/usepushNotification";
import useStore from "../context/useStore";
import { commonStyles } from "../css/common";
import BranchInfo from "../pages/admin/BranchInfo";
import Commission from "../pages/admin/Commission";
import EditProduct from "../pages/admin/EditProduct";
import EditShop from "../pages/admin/EditShop";
import Production from "../pages/admin/Production";
import ProductionHistory from "../pages/admin/ProductionHistory";
import PurchasedDetails from "../pages/admin/PurchasedDetails";
import Error from "../pages/Error";
import { role, sendnotification } from "../services/common";
import Splash from "./utilitise/Splash";

const Home = React.lazy(() => import("../pages/admin/Home"));
const Login = React.lazy(() => import("../pages/Login"));
const Customers = React.lazy(() => import("../pages/Customers"));
const AddProduct = React.lazy(() => import("../pages/admin/AddProduct"));
const AddShop = React.lazy(() => import("../pages/admin/AddShop"));
const CompleteOrder = React.lazy(() => import("../pages/CompleteOrder"));
const CreateNote = React.lazy(() => import("../pages/CreateNote"));
const CreateOrder = React.lazy(() => import("../pages/CreateOrder"));
const CustomerDetails = React.lazy(() => import("../pages/CustomerDetails"));
const ManageMan = React.lazy(() => import("../pages/admin/ManageUsers"));
const NotificationsPage = React.lazy(() => import("../pages/Notifications"));
const OrderDetails = React.lazy(() => import("../pages/OrderDetails"));
const Orders = React.lazy(() => import("../pages/Orders"));
const ManageProduct = React.lazy(() => import("../pages/admin/ManageProduct"));
const AddUser = React.lazy(() => import("../pages/admin/AddUser"));
const Profile = React.lazy(() => import("../pages/Profile"));
const Transitions = React.lazy(() => import("../pages/Transitions"));
const AddSupplyer = React.lazy(() => import("../pages/admin/AddSupplyer"));
const ManageSupplyer = React.lazy(() =>
  import("../pages/admin/ManageSupplyer")
);
const Supplyer = React.lazy(() => import("../pages/admin/Supplyer"));
const BalanceTransfer = React.lazy(() => import("../pages/BalanceTransfer"));
const Message = React.lazy(() => import("../components/utilitise/Message"));
const Loading = React.lazy(() => import("../components/utilitise/Loading"));
const PurchaseProduct = React.lazy(() =>
  import("../pages/admin/PurchaseProduct")
);
const ExpenseType = React.lazy(() => import("../pages/admin/ExpenseType"));
const AddExpense = React.lazy(() => import("../pages/admin/AddExpense"));
const ExpenseReport = React.lazy(() => import("../pages/ExpenseReport"));

//for routing;
const Stack = createNativeStackNavigator();
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function Layout() {
  const store = useStore();
  const { notification } = usePushNotifications();
  const initialRoute = !store?.user
    ? "login"
    : store?.user?.designation === "Admin"
    ? "home"
    : "profile";

  useEffect(() => {
    if (notification) {
      sendnotification(notification, store);
    }
  }, [notification]);
  useEffect(() => {
    if (!store.userLoading) {
      SplashScreen.hideAsync();
    }
  }, [store.userLoading]);

  return (
    <SafeAreaView style={commonStyles.body}>
      <Suspense>
        <NavigationContainer>
          <StatusBar style='light' backgroundColor={color.green} />
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{ headerShown: false }}
          >
            {store.userLoading ? (
              <Stack.Screen name='loading' component={Splash} />
            ) : store.user ? (
              <>
                {store.user.designation === role.admin ? (
                  <>
                    <Stack.Screen name='home' component={Home} />
                    <Stack.Screen name='addProduct' component={AddProduct} />
                    <Stack.Screen name='editProduct' component={EditProduct} />

                    <Stack.Screen
                      name='manageProduct'
                      component={ManageProduct}
                    />
                    <Stack.Screen name='supplyer' component={Supplyer} />
                    <Stack.Screen name='addSupplyer' component={AddSupplyer} />
                    <Stack.Screen
                      name='manageSupplyer'
                      component={ManageSupplyer}
                    />

                    <Stack.Screen name='purchase' component={PurchaseProduct} />
                    <Stack.Screen name='expenseType' component={ExpenseType} />
                    <Stack.Screen name='info' component={BranchInfo} />
                    <Stack.Screen name='commission' component={Commission} />
                    <Stack.Screen
                      name='purchasedDetails'
                      component={PurchasedDetails}
                    />
                  </>
                ) : null}
                {store.user.designation === role.admin ||
                store.user.designation === role.store_manager ? (
                  <>
                    <Stack.Screen name='stock' component={Home} />
                    <Stack.Screen name='manageUsers' component={ManageMan} />
                    <Stack.Screen name='production' component={Production} />
                    <Stack.Screen
                      name='production-history'
                      component={ProductionHistory}
                    />
                  </>
                ) : null}
                <Stack.Screen name='profile' component={Profile} />
                <Stack.Screen name='order' component={Orders} />
                <Stack.Screen name='createNote' component={CreateNote} />
                <Stack.Screen
                  name='notification'
                  component={NotificationsPage}
                />
                <Stack.Screen name='orderDetails' component={OrderDetails} />
                <Stack.Screen name='completeOrder' component={CompleteOrder} />
                <Stack.Screen
                  name='customerDetails'
                  component={CustomerDetails}
                />
                <Stack.Screen name='addExpense' component={AddExpense} />
                <Stack.Screen
                  name='balanceTransfer'
                  component={BalanceTransfer}
                />
                <Stack.Screen name='expenseReport' component={ExpenseReport} />
                <Stack.Screen name='createOrder' component={CreateOrder} />
                <Stack.Screen name='addshop' component={AddShop} />
                <Stack.Screen name='editshop' component={EditShop} />
                <Stack.Screen name='addUser' component={AddUser} />
                <Stack.Screen name='customer' component={Customers} />
                <Stack.Screen name='transitions' component={Transitions} />
                <Stack.Screen name='error' component={Error} />
              </>
            ) : (
              <Stack.Screen name='login' component={Login} />
            )}
          </Stack.Navigator>

          <Message />
          <Loading />
        </NavigationContainer>
      </Suspense>
    </SafeAreaView>
  );
}

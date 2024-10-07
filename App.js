import { GestureHandlerRootView } from "react-native-gesture-handler";

import StoreProvider from "./context/StoreProvider";
import { Layout } from "./components/Layout";

export default function App() {
  return (
    <StoreProvider>
      <GestureHandlerRootView>
        <Layout />
      </GestureHandlerRootView>
    </StoreProvider>
  );
}

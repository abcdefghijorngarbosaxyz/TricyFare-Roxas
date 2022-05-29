import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "./screens/Main";
import Selection from "./screens/Selection";
import AfterTravel from "./screens/AfterTravel";

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Selection" component={Selection} />
          <RootStack.Screen name="Main" component={Main} />
          <RootStack.Screen name="AfterTravel" component={AfterTravel} />
        </RootStack.Navigator>
      </NavigationContainer>
      <StatusBar translucent={true} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

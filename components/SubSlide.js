import React from "react";
import * as Font from "expo-font";
import { View, Text, StyleSheet } from "react-native";

import SelectionButton from "./SelectionButton";

export default function SubSlide({ minimum, add, last, navigation }) {
  const [fontLoaded, setFontLoaded] = React.useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      "SFProText-Semi": require("../assets/fonts/SF-Pro-Text-Semibold.otf"),
      "SFProText-Bold": require("../assets/fonts/SF-Pro-Text-Bold.otf"),
    });
    setFontLoaded(true);
  };

  React.useEffect(() => {
    loadFont();
  }, []);
  if (fontLoaded) {
    return (
      <View style={styles.container}>
        <Text>
          Minimum:{" "}
          <Text style={styles.minimum}>
            &#8369;{parseFloat(minimum).toFixed(2)}
          </Text>
        </Text>
        <Text>
          Additional: <Text style={styles.add}>&#8369;{add}</Text>/km
        </Text>
        <Text
          style={{ marginTop: 24 }}
          onPress={() => navigation.navigate("Main", { minimum, add })}
        >
          <SelectionButton label="Select Fare Rate" />
        </Text>
      </View>
    );
  } else return null;
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    flex: 1,
  },
  minimum: {
    fontFamily: "SFProText-Bold",
    fontSize: 56,
    color: "#0C0D34",
    lineHeight: 72,
  },
  add: {
    fontFamily: "SFProText-Semi",
    fontSize: 24,
    lineHeight: 32,
    color: "#0C0D34",
  },
});

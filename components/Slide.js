import React from "react";
import { View, Text, Dimensions, StyleSheet, Image } from "react-native";
import * as Font from "expo-font";

const { width, height } = Dimensions.get("window");

export const SLIDE_HEIGHT = 0.64 * height;

export default function Slide({ label, right, picture }) {
  const [fontLoaded, setFontLoaded] = React.useState(false);

  const loadFont = async () => {
    await Font.loadAsync({
      "SFProText-Bold": require("../assets/fonts/SF-Pro-Text-Bold.otf"),
      "SFProText-Normal": require("../assets/fonts/SF-Pro-Text-Regular.otf"),
    });
    setFontLoaded(true);
  };

  React.useEffect(() => {
    loadFont();
  }, []);

  const transform = [
    { translateY: (SLIDE_HEIGHT - 100) / 2 },
    { translateX: right ? width / 2 - 50 : -width / 2 + 50 },
    { rotate: right ? "-90deg" : "90deg" },
  ];

  if (fontLoaded) {
    return (
      <View style={styles.container}>
        <View style={styles.underlay}>
          <Image
            source={picture.src}
            style={{
              ...StyleSheet.absoluteFillObject,
              width: undefined,
              height: undefined,
              borderBottomRightRadius: 75,
              borderBottomLeftRadius: 75,
            }}
          />
        </View>
        <View style={[styles.titleContainer, { transform }]}>
          <Text style={styles.title}>{label}</Text>
        </View>
      </View>
    );
  } else return null;
}

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
  },
  title: {
    fontSize: 72,
    lineHeight: 72,
    color: "white",
    fontFamily: "SFProText-Bold",
    textAlign: "center",
  },
  titleContainer: {
    height: 80,
    justifyContent: "center",
  },
  underlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
});

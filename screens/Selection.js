import React from "react";
import { StyleSheet, Dimensions, View, Animated } from "react-native";

import Slide, { SLIDE_HEIGHT } from "../components/Slide";
import SubSlide from "../components/SubSlide";
import Pagination from "../components/Pagination";

const { width, height } = Dimensions.get("window");
const Slides = [
  {
    label: "Regular",
    backgroundColor: "#BFEAF5",
    minimum: 10.0,
    add: 1.0,
    picture: {
      src: require("../assets/regular.png"),
      height: 600,
      width: 408,
    },
  },
  {
    label: "Student",
    backgroundColor: "#BEECC4",
    minimum: 8.0,
    add: 0.5,
    picture: {
      src: require("../assets/student.png"),
      height: 500,
      width: 430,
    },
  },
  {
    label: "Senior",
    backgroundColor: "#FFE4D9",
    minimum: 8.0,
    add: 0.5,
    picture: {
      src: require("../assets/senior.png"),
      height: 600,
      width: 407,
    },
  },
  {
    label: "Pandemic",
    backgroundColor: "#FFDDDD",
    minimum: 20.0,
    add: 5.0,
    picture: {
      src: require("../assets/pandemic.png"),
      height: 460,
      width: 612,
    },
  },
];

export default function Selection({ navigation }) {
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const boxInterpolation = scrollX.interpolate({
    inputRange: Slides.map((_, index) => index * width),
    outputRange: Slides.map((slide) => slide.backgroundColor),
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.slider, { backgroundColor: boxInterpolation }]}
      >
        <Animated.ScrollView
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={1}
          {...{ onScroll }}
        >
          {Slides.map(({ label, picture }, index) => {
            return (
              <View key={index}>
                <Slide {...{ label, picture }} right={index % 2} />
              </View>
            );
          })}
        </Animated.ScrollView>
      </Animated.View>
      <View style={styles.footer}>
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: boxInterpolation,
          }}
        />
        <View style={[styles.footerContent]}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              flexDirection: "row",
              height: 75,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Slides.map((_, index) => (
              <Pagination
                key={index}
                currentIndex={Animated.divide(scrollX, width)}
                {...{ index }}
              />
            ))}
          </View>
          <Animated.View
            style={{
              flexDirection: "row",
              flex: 1,
              alignItems: "flex-end",
              width: width * Slides.length,
              transform: [{ translateX: Animated.multiply(scrollX, -1) }],
            }}
          >
            {Slides.map(({ minimum, add }, index) => (
              <SubSlide
                navigation={navigation}
                key={index}
                last={index == Slides.length - 1}
                {...{ minimum, add }}
              />
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  slider: {
    height: SLIDE_HEIGHT,
    borderBottomRightRadius: 75,
  },
  footer: {
    flex: 1,
  },
  footerContent: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 75,
  },
  underlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "red",
    overflow: "hidden",
  },
});

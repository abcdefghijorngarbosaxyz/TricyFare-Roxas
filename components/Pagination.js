import React from "react";
import { Animated } from "react-native";

export default function Pagination({ index, currentIndex }) {
  const opacity = currentIndex.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [0.5, 1, 0.5],
    extrapolate: "clamp",
  });
  const scale = currentIndex.interpolate({
    inputRange: [index - 1, index, index + 1],
    outputRange: [1, 1.25, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        opacity,
        backgroundColor: "#FCEFC2",
        width: 8,
        height: 8,
        borderRadius: 4,
        margin: 4,
        transform: [{ scale }],
      }}
    ></Animated.View>
  );
}

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    height: 48,
    width: 200,
    backgroundColor: "#FCEFC2",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    color: "#0C0D34",
    textAlign: "center",
  },
});

export default function SelectionButton({ label }) {
  return (
    <RectButton style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </RectButton>
  );
}

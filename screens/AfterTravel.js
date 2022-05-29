import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import email from "react-native-email";
import { RectButton } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

export default class AfterTravel extends React.Component {
  render() {
    const { fromLocation, toLocation, totalCost, distanceTravelled } =
      this.props.route.params;
    let fromWhere = fromLocation.replace(
      ", Western Visayas, 5800, Pilipinas / Philippines",
      ""
    );
    let toWhere = toLocation.replace(
      ", Western Visayas, 5800, Pilipinas / Philippines",
      ""
    );

    const sendEmail = () => {
      const to = ["leonor.angela@student.capsu.edu.ph"];
      email(to, {
        subject: "Violation Report",
        body: "",
      }).catch(console.error);
    };
    return (
      <View style={styles.container}>
        <View style={styles.mainArea}>
          <Text style={styles.labelText}>Total cost: </Text>
          <Text style={[styles.infoText, { fontSize: 80, marginBottom: 24 }]}>
            &#8369;{parseFloat(totalCost).toFixed(2)}
          </Text>
          <Text style={styles.labelText}>Total distance: </Text>
          <Text style={[styles.infoText, { fontSize: 40, marginBottom: 24 }]}>
            {parseFloat(distanceTravelled).toFixed(2)} km
          </Text>
          <Text style={styles.labelText}>From: </Text>

          <Text
            style={[
              styles.infoText,
              {
                fontSize: 20,
                textAlign: "center",
                paddingHorizontal: 24,
                marginBottom: 24,
              },
            ]}
          >
            {fromWhere}
          </Text>
          <Text style={styles.labelText}>To: </Text>

          <Text
            style={[
              styles.infoText,
              { fontSize: 20, textAlign: "center", paddingHorizontal: 24 },
            ]}
          >
            {toWhere}
          </Text>
        </View>
        <View style={styles.reportArea}>
          <Text onPress={() => BackHandler.exitApp()}>
            <RectButton
              style={{
                borderRadius: 25,
                height: 48,
                width: 120,
                backgroundColor: "teal",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 24,
              }}
            >
              <View>
                <Text
                  style={{ fontSize: 16, color: "white", textAlign: "center" }}
                >
                  Exit app
                </Text>
              </View>
            </RectButton>
          </Text>
          <Text> or </Text>
          <Text>
            <TouchableOpacity onPress={() => sendEmail()} style={styles.button}>
              <View>
                <Text style={styles.buttonLabel}>Report a violation</Text>
              </View>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FCEFC2",
  },
  labelText: {
    fontFamily: "SFProText-Normal",
    fontSize: 16,
  },
  infoText: {
    fontFamily: "SFProText-Bold",
  },
  mainArea: {
    width,
    flex: 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  reportArea: {
    width,
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  button: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

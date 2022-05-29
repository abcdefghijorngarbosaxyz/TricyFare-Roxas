import React from "react";
import { StyleSheet, View, Text, Platform, Dimensions } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import MapView, {
  MarkerAnimated,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import haversine from "haversine";
import * as Location from "expo-location";
import SelectionButton from "../components/SelectionButton";

const LATITUDE_DELTA = 0.007;
const LONGITUDE_DELTA = 0.007;
const LATITUDE = 11.58291;
const LONGITUDE = 122.753156;

const { height, width } = Dimensions.get("window");

class Main extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0.007,
        longitudeDelta: 0.007,
      }),
      startTracking: false,
      fromLocation: "",
      toLocation: "",
    };
  }

  trackLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status != "granted") {
      return;
    }

    Location.installWebGeolocationPolyfill();

    const { coordinate } = this.state;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { routeCoordinates, distanceTravelled } = this.state;
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        if (Platform.OS === "android") {
          if (this.marker) {
            this.marker.animateMarkerToCoordinate(newCoordinate, 500);
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }

        this.setState({
          latitude,
          longitude,
          routeCoordinates: routeCoordinates.concat([newCoordinate]),
          distanceTravelled:
            distanceTravelled + this.calcDistance(newCoordinate),
          prevLatLng: newCoordinate,
          coordinate: newCoordinate,
        });
        fetch(
          "http://nominatim.openstreetmap.org/reverse?format=json&lon=" +
            longitude +
            "&lat=" +
            latitude
        )
          .then((response) => response.json())
          .then((responseJson) => {
            const { display_name } = responseJson;
            this.setState({ toLocation: display_name });
          });
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
        distanceFilter: 10,
      }
    );
  };

  startLocationTracking = async () => {
    let { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      const { latitude, longitude } = coords;
      fetch(
        "http://nominatim.openstreetmap.org/reverse?format=json&lon=" +
          longitude +
          "&lat=" +
          latitude
      )
        .then((response) => response.json())
        .then((responseJson) => {
          const { display_name } = responseJson;
          this.setState({ fromLocation: display_name });
        });
    }
    this.interval = setInterval(() => this.trackLocation(), 1000);
  };

  stopLocationTracking = async () => {
    clearInterval(this.interval);
  };

  componentDidMount() {
    // Location.installWebGeolocationPolyfill();
    // const { coordinate } = this.state;
    // this.watchID = navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     const { latitude, longitude } = position.coords;
    //     const newCoordinate = {
    //       latitude,
    //       longitude,
    //     };
    //     if (Platform.OS === "android") {
    //       if (this.marker) {
    //         this.marker.animateMarkerToCoordinate(newCoordinate, 500);
    //       }
    //     } else {
    //       coordinate.timing(newCoordinate).start();
    //     }
    //     this.setState({
    //       latitude,
    //       longitude,
    //       coordinate: newCoordinate,
    //     });
    //   },
    //   (error) => console.log(error),
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 20000,
    //     maximumAge: 10000,
    //     distanceFilter: 10,
    //   }
    // );
  }

  componentWillUnmount() {}

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  calcDistance = (newLatLng) => {
    const { prevLatLng } = this.state;
    return haversine(prevLatLng, newLatLng) || 0;
  };

  calcFare = (minimum, add) => {
    const succeeding =
      this.state.distanceTravelled > 5 ? this.state.distanceTravelled - 4 : 0;
    const succeedingCost = parseInt(succeeding) * add;
    const totalCost =
      this.state.distanceTravelled > 0 ? minimum + succeedingCost : 0;
    return totalCost;
  };

  render() {
    const { minimum, add } = this.props.route.params;
    const pin = () => {
      return (
        <Svg height={20} width={20}>
          <Ellipse
            cx="10"
            cy="10"
            rx="10"
            ry="10"
            fill="red"
            stroke="#ffffffaa"
            strokeWidth="5"
          />
        </Svg>
      );
    };
    return (
      <View style={styles.container}>
        <MapView
          customMapStyle={styles.mapStyle}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showUserLocation
          followUserLocation
          region={this.getMapRegion()}
        >
          <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
          <MarkerAnimated
            ref={(marker) => {
              this.marker = marker;
            }}
            coordinate={this.state.coordinate}
          >
            <View>{pin()}</View>
          </MarkerAnimated>
        </MapView>
        <View
          style={{
            backgroundColor: "white",
            height: height * 0.2,
            width,
            borderTopLeftRadius: 75,
            borderTopRightRadius: 75,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {this.state.startTracking ? (
            <Text
              onPress={() => {
                this.stopLocationTracking();
                this.setState({ startTracking: false });
                this.props.navigation.navigate("AfterTravel", {
                  totalCost: this.calcFare(minimum, add),
                  distanceTravelled: this.state.distanceTravelled,
                  fromLocation: this.state.fromLocation,
                  toLocation: this.state.toLocation,
                });
              }}
            >
              <SelectionButton label={this.state.startTracking && "Stop"} />
            </Text>
          ) : (
            <Text
              onPress={() => {
                this.setState({ startTracking: true });
                this.startLocationTracking();
              }}
            >
              <SelectionButton label="Start" />
            </Text>
          )}
        </View>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.8)",
            height: 160,
            width: width / 1.5,
            ...StyleSheet.absoluteFillObject,
            marginLeft: width / 12,
            marginTop: height / 16,
            borderRadius: 37.5,
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 12, color: "#0C0D34" }}>To pay</Text>
          <Text
            style={{
              fontSize: 52,
              fontFamily: "SFProText-Bold",
              color: "#0C0D34",
            }}
          >
            &#8369;{parseFloat(this.calcFare(minimum, add)).toFixed(2)}
          </Text>
          <Text style={{ fontSize: 24, color: "#0C0D34" }}>
            {parseFloat(this.state.distanceTravelled).toFixed(2)} km
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
    justifyContent: "flex-end",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapStyle: [
    {
      featureType: "administrative",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#444444",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.fill",
      stylers: [
        {
          hue: "#ffb300",
        },
        {
          saturation: "32",
        },
        {
          lightness: "0",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      stylers: [
        {
          hue: "#ffb800",
        },
        {
          saturation: "54",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          hue: "#ffb800",
        },
        {
          saturation: "29",
        },
        {
          lightness: "64",
        },
        {
          gamma: "1",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#ffda7b",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#ffda7b",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#ffda7b",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#d5cdb6",
        },
        {
          saturation: "-60",
        },
        {
          visibility: "on",
        },
      ],
    },
  ],
});

export default Main;

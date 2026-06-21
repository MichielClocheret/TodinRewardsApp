import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";

import GoBack from "@/app/components/GoBack";
import globalStyles from "@/app/css/styles";
import GradientView from "@/app/components/GradientView";
import colors from "@/app/css/colors";

const locatie = {
  latitude: 50.866187419880895,
  longitude: 4.1772193082692315,
};

const Headquarters = () => {
  return (
    <GradientView variant="screen" style={globalStyles.gradient}>
      <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: "transparent" }]}>
        <View style={globalStyles.container}>
          <GoBack />
          <Text style={[globalStyles.titleLeft, styles.title]}>Headquarters</Text>
          <Text style={[globalStyles.subTitle, styles.subtitle]}>
            You can find us in Ternat
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: locatie.latitude,
                longitude: locatie.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={locatie}
                title="Todin HQ"
                description="Ternat, Belgium"
              />
            </MapView>
          </View>
        </View>
      </SafeAreaView>
    </GradientView>
  );
};

export default Headquarters;

const styles = StyleSheet.create({
  title: {
    marginBottom: 0,
    marginTop: 24,
  },
  subtitle: {
    textAlign: "left",
    marginTop: 8,
    marginBottom: 16,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.stroke,
  },
  map: {
    flex: 1,
  },
});

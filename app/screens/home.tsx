import { FlatList, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { LinearGradient } from "expo-linear-gradient";

import globalStyles from '@/app/css/styles';
import Navigation from '../components/Navigation';
import colors from '../css/colors';
import Search from '../components/Search';
import ShopCard from '../components/ShopCard';
import { getShops, Shop } from '../API/shop';
import { HomeStackNavProps } from '../navigators/types';
import { useRefresh } from '../hooks/useRefresh';

const Home = ({ navigation }: HomeStackNavProps<"homeMain">) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [shops, setShops] = useState<Shop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [shopsError, setShopsError] = useState<string | null>(null);
  const headerHeight = Math.max(height * 0.3, 240);

  const filteredShops = shops
    .filter((shop) => shop.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  const loadShops = async () => {
    const result = await getShops();

    if (!result.success) {
      setShopsError(result.message || "Unable to load shops.");
      return;
    }

    setShops(result.shops || []);
  };

  useEffect(() => {
    loadShops();
  }, []);

  const { refreshing, onRefresh } = useRefresh(loadShops);

  return (
    <SafeAreaView
      style={globalStyles.safeArea}
      edges={["left", "right"]}
    >
      <LinearGradient
        style={[styles.header, { paddingTop: insets.top + 20, minHeight: headerHeight }]}
        colors={[colors.todinBlueDark, colors.todinBlueLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.5, y: 1.2 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.priceContainer}>
            <Image style={styles.logoIcon} source={require("@/assets/media/LogoTodinWhite.png")} />
          </View>
          <View style={styles.searchWrapper}>
            <Search
              showFilter={false}
              style={styles.searchBar}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search shops"
            />
            <Pressable
              style={[styles.transparent, styles.spinningWheel]}
              onPress={() => navigation.navigate("spinning")}
            >
              <Image
                style={styles.spinningWheelIcon}
                source={require("@/assets/media/SpinningWheel.png")}
              />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.contentWrapper}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={globalStyles.container}>
          {shopsError ? <Text style={styles.errorText}>{shopsError}</Text> : null}

          <FlatList
            style={styles.flatList}
            data={filteredShops}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.shopsList}
            columnWrapperStyle={styles.shopsRow}
            renderItem={({ item }) => (
              <ShopCard item={item} />
            )}
          />
          {!shopsError && filteredShops.length === 0 ? (
            <Text style={styles.emptyStateText}>No shops found.</Text>
          ) : null}
        </View>
      </ScrollView>
      <Navigation activeTab="home" />
    </SafeAreaView>
  );
}

export default Home

const styles = StyleSheet.create({
  header: {
    width: "100%",
    zIndex: 0,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 48,
    justifyContent: "flex-start",
  },
  priceContainer:{
    width: "100%",
    flexDirection:"row",
    justifyContent: "center",
    alignItems: "center",
  },

  transparent: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: colors.whiteTransparent,
    borderRadius: 12,
  },

  spinningWheel:{
    flexShrink: 0,
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius:12,
    alignItems: "center",
    justifyContent: "center",
  },
  spinningWheelIcon: {
    width: 30,
    height: 30,
  },
  searchWrapper: {
    flexDirection:"row",
    marginTop: 16,
    alignItems: "center",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    width: "auto",
  },

  walletPriceText: {
    color: colors.white,
    fontFamily: "DMSans-Medium",
    fontSize: 16,
    fontWeight: "500",
  },
  logoIcon:{
    width:150,
    height:35,
    resizeMode:"contain",
  },
  
  content: {
    paddingBottom: 120,
  },

  contentWrapper: {
    marginTop: -60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.white,
    zIndex: 1,
    elevation: 1,
  },
  flatList:{
    paddingTop:12
  },

  shopsList:{
    gap: 12,
  },

  shopsRow: {
    gap: 12,
  },

  errorText: {
    color: "#C62828",
    marginBottom: 12,
    fontFamily: "DMSans-Regular",
  },
  emptyStateText: {
    paddingTop: 20,
    color: colors.grey,
    fontFamily: "DMSans-Regular",
    fontSize: 16,
    textAlign: "center",
  },
})

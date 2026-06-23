import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SvgUri } from 'react-native-svg'

import { Shop } from '@/app/API/shop'
import globalStyles from '@/app/css/styles'
import colors from '@/app/css/colors'
import CheckBadge from '@/assets/media/CheckBadge.svg'
import ArrowTop from '@/assets/media/ArrowUpRight.svg'

type ShopCardProps = {
  item: Shop;
};

const ShopCard = ({ item }: ShopCardProps) => {
  const isSvgLogo = item.logo.toLowerCase().includes('.svg');

  const OpenShop = async () => {
    if (!item.url) return;
    await Linking.openURL(item.url);
  };

  return (
    <View style={styles.shopCard}>
      <View style={styles.shopLogoRow}>
        <View style={styles.shopLogo}>
          {isSvgLogo
            ? <SvgUri uri={item.logo} width={55} height={55} />
            : <Text>{item.name}</Text>}
        </View>
      </View>

      <View>
        <View style={styles.badgeAndArrowContainer}>
          <Text style={[globalStyles.titleLeft, styles.shopName]}>{item.name}</Text>
          <CheckBadge width={17.5} height={17.5} />
        </View>
        <Text style={[globalStyles.subTitle, styles.spendingReward]}>
          {item.spending_reward}% Cashback
        </Text>
        <TouchableOpacity style={styles.badgeAndArrowContainer} onPress={OpenShop}>
          <Text style={[globalStyles.bannerTextBlue, styles.linkShop]}>
            Go to {item.name}
          </Text>
          <ArrowTop width={17.5} height={17.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ShopCard;

const styles = StyleSheet.create({
  shopCard: {
    flex: 1 / 2,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  shopLogoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginLeft: -5,
    marginTop: -5,
  },
  shopLogo: {},
  badgeAndArrowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  shopName: {
    fontSize: 20,
    marginBottom: 0,
  },
  spendingReward: {
    textAlign: 'left',
    fontSize: 16,
    marginBottom: 16,
  },
  linkShop: {
    textAlign: 'auto',
  },
});

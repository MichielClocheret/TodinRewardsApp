import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TierData } from "@/app/API/tiers";
import TierCoin from "@/assets/media/TierCoin.svg";
import CheckStroke from "@/assets/media/CheckStroke.svg";
import colors from "../css/colors";

type TierCardProps = {
  tier: TierData;
  isCurrentTier?: boolean;
};

const TierCard = ({ tier, isCurrentTier = false }: TierCardProps) => {
  const Badge = tier.badge;
  return (
    <View style={styles.tierCardWrapper}>
      {isCurrentTier && (
        <View style={styles.yourTierBadgeContainer}>
          <View style={styles.yourTierBadge}>
            <Text style={styles.yourTierBadgeText}>Your Tier</Text>
          </View>
        </View>
      )}
      <View style={[styles.tierCard, isCurrentTier && styles.tierCardActive]}>
        <Badge width={48} height={48} />
        <View style={styles.tierCardHeader}>
          <Text style={styles.tierName}>{tier.name}</Text>
          <View style={styles.tierTdn}>
            <TierCoin width={13} height={13} />
            <Text style={styles.tierTdnText}>{tier.tdnRequired} TDN</Text>
          </View>
        </View>
        <Text style={styles.tierSubtitle}>{tier.subtitle}</Text>
        <View style={styles.tierBulletPointsContainer}>
          {tier.points.map((point, index) => (
            <View key={index} style={styles.tierBulletPoint}>
              <CheckStroke width={16.25} height={16.25} />
              <Text style={styles.tierPoint}>{point}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default TierCard;

const styles = StyleSheet.create({
  tierCardWrapper: {
    marginVertical: 6,
  },
  tierCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  tierCardActive: {
    borderColor: colors.todinBlue,
  },
  yourTierBadgeContainer: {
    position: "absolute",
    zIndex: 1,
    top: "0.5%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  yourTierBadge: {
    backgroundColor: colors.todinBlueBackground,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  yourTierBadgeText: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    fontWeight: "500",
    color: colors.todinBlue,
  },
  tierCardHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  tierName: {
    fontSize: 20,
    fontFamily: "DMSans-Medium",
    fontWeight: "600",
  },
  tierTdn: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    backgroundColor: colors.todinBlueBackground,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  tierTdnText: {
    fontSize: 14,
    fontFamily: "DMSans-Medium",
    color: colors.todinBlue,
    fontWeight: "500",
  },
  tierSubtitle: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    color: colors.grey3,
    marginTop: 8,
    marginBottom: 24,
  },
  tierBulletPointsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tierBulletPoint: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  tierPoint: {
    fontSize: 14,
    fontFamily: "DMSans-Regular",
    marginTop: 2,
    maxWidth: 320,
  },
});

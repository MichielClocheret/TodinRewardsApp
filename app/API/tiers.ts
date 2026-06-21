import React from "react";
import { SvgProps } from "react-native-svg";

import BronzePerk from "@/assets/media/BronzePerk.svg";
import SilverPerk from "@/assets/media/SilverPerk.svg";
import GoldPerk from "@/assets/media/GoldPerk.svg";
import DiamondPerk from "@/assets/media/DiamondPerk.svg";
import VipPerk from "@/assets/media/VipPerk.svg";

export type TierData = {
  id: string;
  name: string;
  tdnRequired: string;
  subtitle: string;
  points: string[];
  badge: React.ComponentType<SvgProps>;
};

export const tiers: TierData[] = [
  {
    id: "bronze",
    name: "Bronze",
    tdnRequired: "1.000",
    subtitle: "Your journey starts here.",
    badge: BronzePerk,
    points: [
      "1% cashback on purchases.",
      "Access to community & basic rewards.",
      "Eligible for general promotions.",
      "Basic governance voting rights.",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    tdnRequired: "10.000",
    subtitle: "Level up your rewards.",
    badge: SilverPerk,
    points: [
      "1% cashback on purchases.",
      "Access to selected exclusive promotions.",
      "Priority customer support.",
      "Early access to new features.",
      "Increased governance voting power.",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    tdnRequired: "1500",
    subtitle: "Where the perks get golden.",
    badge: GoldPerk,
    points: [
      "1% cashback on purchases.",
      "Full access to exclusive partner events.",
      "Higher referral rewards.",
      "Access to Gold-only staking pools.",
      "Premium governance voting power.",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    tdnRequired: "5000",
    subtitle: "Elite status, elite rewards.",
    badge: DiamondPerk,
    points: [
      "1% cashback on purchases.",
      "Dedicated account manager & support.",
      "Monthly bonus rewards.",
      "Early whitelist for partner campaigns.",
      "Enhanced transaction security.",
      "Free subscriptions X and NordVPN",
    ],
  },
  {
    id: "vip",
    name: "VIP",
    tdnRequired: "10000",
    subtitle: "The ultimate Todin experience.",
    badge: VipPerk,
    points: [
      "1% cashback on purchases.",
      "Access to VIP-only events & exclusive drops.",
      "Lifetime staking perk with auto-compounding.",
      "Maximum referral rewards.",
      "Top-tier priority in governance & decision-making.",
      "Free subscriptions X and NordVPN",
    ],
  },
];

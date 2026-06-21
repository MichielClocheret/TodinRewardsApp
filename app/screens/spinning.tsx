// Animation spinning wheel met claude, de rest van structuur zelf

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, Text, View, Animated, Dimensions, Image, Modal, Easing, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, G, Text as SvgText } from "react-native-svg";

import globalStyles from "@/app/css/styles";
import colors from "../css/colors";
import GoBack from "../components/GoBack";
import Button from "../components/Button";

const { width, height } = Dimensions.get("window");
const WHEEL = Math.min(width - 48, 300);
const R = WHEEL / 2;
const N = 8;
const FULL_ROTATIONS = 6;
const SPIN_DURATION = 4000;
const GRADIENT_COLORS = [colors.todinBlueDark, colors.todinBlueLight] as const;
const CONTAINER_STYLE = { flex: 1 } as const;

type Prize = {
  icon: string;
  label: string;
  sublabel: string;
};

const PRIZES: Prize[] = [
  { icon: "🪙", label: "+1", sublabel: "Todin coins" },
  { icon: "🪙", label: "x500", sublabel: "Todin coins" },
  { icon: "🪙", label: "x25", sublabel: "Todin coins" },
  { icon: "🎲", label: "Free", sublabel: "Spin" },
  { icon: "🪙", label: "x50", sublabel: "Todin coins" },
  { icon: "🪙", label: "x2", sublabel: "Todin coins" },
  { icon: "🪙", label: "x25", sublabel: "Todin coins" },
  { icon: "🪙", label: "x2", sublabel: "Todin coins" },
];

// ── Confetti ──────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#FF8DA1", "#FFE27A", "#7EF0C1", "#818CF8",
  "#FCD34D", "#FFFFFF", "#A5F3FC", colors.todinBlueLight,
];

type ConfettiPiece = {
  color: string;
  size: number;
  angle: number;
  speed: number;
  fallDistance: number;
  wobble: number;
  delay: number;
  spinDir: 1 | -1;
  duration: number;
};

// Deterministic — no random() so no flicker on re-render
const CONFETTI_PIECES: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  size: 7 + (i % 4) * 2,
  angle: i * (360 / 40) + (i % 3) * 9,
  speed: 80 + (i % 6) * 26,
  fallDistance: i % 4 === 0 ? height * 0.92 : 220 + (i % 6) * 85,
  wobble: (i % 2 === 0 ? 1 : -1) * (14 + (i % 5) * 14),
  delay: (i % 7) * 38,
  spinDir: i % 2 === 0 ? 1 : -1,
  duration: 4800 + (i % 5) * 300,
}));

function ConfettiBurst({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const anims = useRef(CONFETTI_PIECES.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (!visible) return;
    anims.forEach((a) => a.setValue(0));

    Animated.parallel(
      anims.map((anim, i) =>
        Animated.sequence([
          Animated.delay(CONFETTI_PIECES[i].delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: CONFETTI_PIECES[i].duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      )
    ).start(onDone);
  }, [visible]);

  if (!visible) return null;

  return (
    <View pointerEvents="none" style={styles.confettiBurst}>
      {CONFETTI_PIECES.map((piece, i) => {
        const anim = anims[i];
        const rad = (piece.angle * Math.PI) / 180;

        const translateX = anim.interpolate({
          inputRange: [0, 0.35, 1],
          outputRange: [0, Math.cos(rad) * piece.speed, Math.cos(rad) * piece.speed + piece.wobble],
        });
        const translateY = anim.interpolate({
          inputRange: [0, 0.28, 1],
          outputRange: [0, -Math.sin(rad) * piece.speed * 0.55, piece.fallDistance],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.12, 0.72, 1],
          outputRange: [0, 1, 1, 0],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${piece.spinDir * 480}deg`],
        });
        const scale = anim.interpolate({
          inputRange: [0, 0.12, 0.8, 1],
          outputRange: [0, 1.3, 1, 0.5],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.confettiPiece,
              {
                width: piece.size,
                height: piece.size * 1.65,
                backgroundColor: piece.color,
                opacity,
                transform: [{ translateX }, { translateY }, { rotate }, { scale }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

// ── Wheel ─────────────────────────────────────────────────────────────────────

function WheelSvg({ spinAnim }: { spinAnim: Animated.Value }) {
  const rotate = spinAnim.interpolate({
    inputRange: [0, FULL_ROTATIONS + 1],
    outputRange: ["0deg", `${(FULL_ROTATIONS + 1) * 360}deg`],
  });

  const segAngle = (2 * Math.PI) / N;

  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <Svg width={WHEEL} height={WHEEL}>
        <Defs>
          <SvgLinearGradient id="g0" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#6F83FF" />
            <Stop offset="100%" stopColor="#4662E8" />
          </SvgLinearGradient>
          <SvgLinearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#5C3BE5" />
            <Stop offset="100%" stopColor="#3D22B8" />
          </SvgLinearGradient>
        </Defs>

        {PRIZES.map((prize, i) => {
          const a0 = i * segAngle - Math.PI / 2;
          const a1 = a0 + segAngle;
          const ir = R * 0.3;

          const x1 = R + R * Math.cos(a0), y1 = R + R * Math.sin(a0);
          const x2 = R + R * Math.cos(a1), y2 = R + R * Math.sin(a1);
          const ix1 = R + ir * Math.cos(a0), iy1 = R + ir * Math.sin(a0);
          const ix2 = R + ir * Math.cos(a1), iy2 = R + ir * Math.sin(a1);

          const d = `M${ix1} ${iy1} L${x1} ${y1} A${R} ${R} 0 0 1 ${x2} ${y2} L${ix2} ${iy2} A${ir} ${ir} 0 0 0 ${ix1} ${iy1}Z`;

          const mid = a0 + segAngle / 2;
          const iconR = R * 0.62;
          const labelR = R * 0.80;
          const ix = R + iconR * Math.cos(mid);
          const iy = R + iconR * Math.sin(mid);
          const lx = R + labelR * Math.cos(mid);
          const ly = R + labelR * Math.sin(mid);

          return (
            <G key={i}>
              <Path
                d={d}
                fill={i % 2 === 0 ? "url(#g0)" : "url(#g1)"}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.6}
              />
              <SvgText x={ix} y={iy + 7} textAnchor="middle" fontSize={18}>{prize.icon}</SvgText>
              <SvgText x={lx} y={ly + 4} textAnchor="middle" fontSize={9} fontWeight="bold" fill="white" fillOpacity={0.9}>{prize.label}</SvgText>
            </G>
          );
        })}

        <Circle cx={R} cy={R} r={R - 2} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2.5} />
        <Circle cx={R} cy={R} r={R * 0.3 + 1} fill="#F6F8FF" />
        <Circle cx={R} cy={R} r={R * 0.3 - 1} fill="none" stroke="rgba(61,34,184,0.14)" strokeWidth={1} />
      </Svg>
    </Animated.View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function Spinning() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const sliceHapticTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const confettiHapticTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Load & play music when screen is focused, stop when it loses focus ──
  useFocusEffect(
    useCallback(() => {
      let sound: Audio.Sound;
      let active = true;

      const loadAndPlay = async () => {
        try {
          await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
          const { sound: s } = await Audio.Sound.createAsync(
            require("@/assets/media/The Wheel of Todin.mp3"),
            { isLooping: true, volume: 0.6 }
          );
          if (!active) { s.unloadAsync(); return; }
          sound = s;
          soundRef.current = s;
          await sound.playAsync();
        } catch (e) {
          // console.warn("Could not load wheel music:", e);
        }
      };

      loadAndPlay();

      return () => {
        active = false;
        sound?.stopAsync();
        sound?.unloadAsync();
        soundRef.current = null;
      };
    }, [])
  );

  // ── Calculate exact times the pointer crosses each slice boundary ──
  const scheduleSliceHaptics = (targetValue: number) => {
    sliceHapticTimers.current.forEach(clearTimeout);
    sliceHapticTimers.current = [];

    const totalDegrees = targetValue * 360;
    const sliceAngle = 360 / N;
    const totalBoundaries = Math.floor(totalDegrees / sliceAngle);

    for (let b = 1; b <= totalBoundaries; b++) {
      const degreesNeeded = b * sliceAngle;
      const progress = degreesNeeded / totalDegrees;

      // Invert Easing.out(Easing.cubic): eased = 1-(1-t)^3 → t = 1-(1-progress)^(1/3)
      const t = 1 - Math.pow(1 - progress, 1 / 3);
      const timeMs = t * SPIN_DURATION;

      const timer = setTimeout(() => {
        Haptics.impactAsync(
          progress > 0.85
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light
        );
      }, timeMs);

      sliceHapticTimers.current.push(timer);
    }
  };

  const clearSliceHaptics = () => {
    sliceHapticTimers.current.forEach(clearTimeout);
    sliceHapticTimers.current = [];
  };

  // ── Fire a tap for each confetti piece right as it bursts into view ──
  // Each piece becomes visible at: delay + duration * 0.12
  // We add a small extra offset so the taps trail just after the win pop
  const scheduleConfettiHaptics = () => {
    confettiHapticTimers.current.forEach(clearTimeout);
    confettiHapticTimers.current = [];

    CONFETTI_PIECES.forEach((piece, i) => {
      // Spread taps across ~1200ms using fall distance and index
      // so they feel like individual pieces rather than one big burst
      const naturalSpread = (piece.fallDistance / height) * 600 + (i % 11) * 80;
      const appearsAt = piece.delay + piece.duration * 0.18 + naturalSpread;

      const timer = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, appearsAt);

      confettiHapticTimers.current.push(timer);
    });
  };

  // ── Win haptics: success pop + fading echoes ──
  const fireWinHaptics = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 120);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 260);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 400);
  };

  const celebrateWin = (prize: Prize) => {
    setSelectedPrize(prize);
    setShowRewardModal(true);
    setShowConfetti(true);
    fireWinHaptics();
    scheduleConfettiHaptics();
  };

  const onSpin = () => {
    if (isSpinning) return;

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const prize = PRIZES[prizeIndex];
    const segmentAngle = 360 / N;
    const targetAngle = (360 - (prizeIndex * segmentAngle + segmentAngle / 2)) % 360;
    const targetValue = FULL_ROTATIONS + targetAngle / 360;

    setSelectedPrize(null);
    setIsSpinning(true);
    spinAnim.setValue(0);
    scheduleSliceHaptics(targetValue);

    Animated.timing(spinAnim, {
      toValue: targetValue,
      duration: SPIN_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      clearSliceHaptics();
      setIsSpinning(false);
      celebrateWin(prize);
    });
  };

  return (
    <ExpoLinearGradient colors={GRADIENT_COLORS} start={{ x: 0, y: 0 }} end={{ x: 1.5, y: 1.2 }} style={CONTAINER_STYLE}>
      <SafeAreaView style={CONTAINER_STYLE} edges={["top"]}>
        <View style={styles.backButtonWrap}>
          <GoBack />
        </View>

        <View style={styles.headerContent}>
          <Text style={[globalStyles.titleMid, styles.headerTitle]}>Free spin every day</Text>
          <Text style={[globalStyles.bannerText, styles.title]}>Spin the wheel to earn Todin coins!</Text>
        </View>

        <View style={styles.wheelWrap}>
          <Svg width={32} height={26} style={styles.pointer}>
            <Path d="M16 23 L3 3 L29 3 Z" fill="white" opacity={0.95} />
          </Svg>
          <WheelSvg spinAnim={spinAnim} />
          <Pressable
            style={styles.centerLogoWrap}
            onPress={onSpin}
            disabled={isSpinning}
          >
            <Image
              source={require("@/assets/media/IconColorLogoTodin.png")}
              style={styles.centerLogo}
            />
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Text style={[globalStyles.subTitle, styles.hint]}>Spin the wheel to get a random reward.</Text>
          <Button
            title={isSpinning ? "Spinning..." : "Spin the Wheel!"}
            variant={isSpinning ? "nonActive" : "fill"}
            onPress={onSpin}
            disabled={isSpinning}
          />
        </View>
      </SafeAreaView>

      <Modal visible={showRewardModal} transparent animationType="fade" onRequestClose={() => setShowRewardModal(false)}>
        <View style={styles.modalOverlay}>
          <ConfettiBurst visible={showConfetti} onDone={() => setShowConfetti(false)} />

          <View style={styles.modalCard}>
            <Text style={[globalStyles.titleMid, styles.modalTitle]}>Reward unlocked</Text>
            <Text style={styles.modalPrizeIcon}>{selectedPrize?.icon}</Text>
            <Text style={[globalStyles.bannerText, styles.modalPrizeText]}>
              {selectedPrize ? `${selectedPrize.label} ${selectedPrize.sublabel}` : ""}
            </Text>
            <Button title="Claim!" variant="fill" onPress={() => setShowRewardModal(false)} />
          </View>
        </View>
      </Modal>
    </ExpoLinearGradient>
  );
}

const styles = StyleSheet.create({
  backButtonWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: "flex-start",
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 20,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 22,
    textAlign: "center",
    opacity: 0.96,
    marginBottom: 4,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 26,
    opacity: 0.88,
  },
  wheelWrap: {
    alignSelf: "center",
    width: WHEEL,
    height: WHEEL,
    position: "relative",
    marginTop: 24,
    marginBottom: 24,
  },
  pointer: {
    position: "absolute",
    top: -22,
    left: WHEEL / 2 - 16,
    zIndex: 10,
  },
  centerLogoWrap: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: R * 0.5,
    height: R * 0.5,
    marginLeft: -(R * 0.25),
    marginTop: -(R * 0.25),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  centerLogo: {
    width: "66%",
    height: "66%",
    resizeMode: "contain",
  },
  actions: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingBottom: 104,
  },
  hint: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
    color: colors.white,
    opacity: 0.88,
    textAlign: "center",
  },
  confettiBurst: {
    position: "absolute",
    left: "50%",
    top: "30%",
    width: 0,
    height: 0,
    zIndex: 20,
  },
  confettiPiece: {
    position: "absolute",
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
  },
  modalTitle: {
    marginBottom: 12,
    color: colors.black,
  },
  modalPrizeIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  modalPrizeText: {
    color: colors.black,
    marginBottom: 24,
  },
});
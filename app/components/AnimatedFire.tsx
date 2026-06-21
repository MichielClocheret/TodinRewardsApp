/* Fire icon zelf gemaakt, animatie CHATGPT */

import React from "react";
import { View, ViewStyle } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import {
  useSharedValue,
  useDerivedValue,
  useFrameCallback,
} from "react-native-reanimated";

type AnimatedFireProps = {
  width?: number;
  height?: number;
  style?: ViewStyle;
};

function S(t: number, speed: number, amp: number, phase = 0): number {
  "worklet";
  return Math.sin(t * speed + phase) * amp;
}

const AnimatedFire = ({
  width = 100,
  height = 100,
  style,
}: AnimatedFireProps) => {
  const elapsed = useSharedValue(0);

  useFrameCallback((info) => {
    elapsed.value += (info.timeSincePreviousFrame ?? 16) / 1000;
  });

  const sx = width / 60;
  const sy = height / 60;

  const outerPath = useDerivedValue(() => {
    const t = elapsed.value;

    // Single dominant frequency + clean harmonic (2x) — no jarring beating
    const tipX = S(t, 0.9, 3.0, 0.0) + S(t, 1.8, 0.9, 0.6);
    const tipY = S(t, 0.75, 2.5, 0.9);

    const leftTongueX = S(t, 1.0, 1.8, 1.3);
    const leftTongueY = S(t, 0.85, 1.5, 2.0);

    const rightTongueX = S(t, 0.95, 1.7, 0.5);
    const rightTongueY = S(t, 0.80, 1.4, 0.8);

    // Body barely moves — just subtle breathing
    const upperLeftX = S(t, 0.6, 0.35, 0.7);
    const upperRightX = S(t, 0.65, 0.35, 1.9);
    const midLeftX = S(t, 0.55, 0.25, 1.3);
    const baseX = S(t, 0.45, 0.15, 2.5);

    const p = Skia.Path.Make();

    p.moveTo((49.8896 + baseX * 0.25) * sx, 42.1652 * sy);

    p.cubicTo(
      (49.9143 + baseX * 0.18) * sx,
      52.8173 * sy,
      (39.2321 + upperLeftX * 0.18) * sx,
      (58.4507 + upperLeftX * 0.05) * sy,
      29.0864 * sx,
      (57.8623 + baseX * 0.05) * sy
    );

    p.cubicTo(
      (16.5478 + upperLeftX * 0.15) * sx,
      (57.1348 + upperLeftX * 0.04) * sy,
      10.6725 * sx,
      49.2298 * sy,
      (9.83175 - midLeftX * 0.1) * sx,
      40.0371 * sy
    );

    p.cubicTo(
      (9.14537 - midLeftX * 0.12) * sx,
      32.5341 * sy,
      (12.8948 + leftTongueX * 0.4) * sx,
      (25.3157 + leftTongueY * 0.35) * sy,
      (16.8185 + leftTongueX * 0.45) * sx,
      (21.2297 + leftTongueY * 0.35) * sy
    );

    p.cubicTo(
      (16.6816 + leftTongueX * 0.16) * sx,
      (22.8641 + leftTongueY * 0.14) * sy,
      (16.8258 + leftTongueX * 0.12) * sx,
      (24.5999 + leftTongueY * 0.1) * sy,
      (17.7216 + leftTongueX * 0.1) * sx,
      25.9737 * sy
    );

    p.cubicTo(
      18.6171 * sx,
      27.3477 * sy,
      20.4282 * sx,
      28.2188 * sy,
      (21.9572 + leftTongueX * 0.12) * sx,
      27.6257 * sy
    );

    p.cubicTo(
      (23.8962 + leftTongueX * 0.16) * sx,
      26.8735 * sy,
      24.4282 * sx,
      24.2909 * sy,
      (23.9227 - leftTongueX * 0.12) * sx,
      22.2735 * sy
    );

    p.cubicTo(
      23.4173 * sx,
      20.2558 * sy,
      22.202 * sx,
      18.4697 * sy,
      (21.7137 + leftTongueX * 0.1) * sx,
      16.4479 * sy
    );

    p.cubicTo(
      (20.9207 + tipX * 0.08) * sx,
      (13.1624 - tipY * 0.1) * sy,
      (22.1979 + tipX * 0.2) * sx,
      (9.62236 - tipY * 0.2) * sy,
      (24.4095 + tipX * 0.28) * sx,
      (7.06663 - tipY * 0.3) * sy
    );

    p.cubicTo(
      (26.6211 + tipX * 0.38) * sx,
      (4.51089 - tipY * 0.42) * sy,
      (29.6617 + tipX * 0.3) * sx,
      (2.81265 - tipY * 0.36) * sy,
      (32.7764 + tipX * 0.22) * sx,
      (1.5 - tipY * 0.48) * sy
    );

    p.cubicTo(
      (30.9035 + tipX * 0.16) * sx,
      (3.69579 - tipY * 0.16) * sy,
      (30.6552 + tipX * 0.08) * sx,
      (7.12638 - tipY * 0.06) * sy,
      (32.1928 + tipX * 0.06) * sx,
      9.5689 * sy
    );

    p.cubicTo(
      (33.6613 + upperRightX * 0.12) * sx,
      11.9023 * sy,
      (36.3521 + upperRightX * 0.14) * sx,
      13.1137 * sy,
      (38.4347 + upperRightX * 0.16) * sx,
      14.9201 * sy
    );

    p.cubicTo(
      (41.9377 + rightTongueX * 0.16) * sx,
      (17.9592 + rightTongueY * 0.16) * sy,
      (43.6259 + rightTongueX * 0.14) * sx,
      (23.2785 + rightTongueY * 0.14) * sy,
      (41.6426 + rightTongueX * 0.12) * sx,
      (27.4701 + rightTongueY * 0.12) * sy
    );

    p.cubicTo(
      (41.1074 + rightTongueX * 0.1) * sx,
      28.6012 * sy,
      (40.3407 + rightTongueX * 0.08) * sx,
      29.6108 * sy,
      (39.8052 + rightTongueX * 0.08) * sx,
      30.7416 * sy
    );

    p.cubicTo(
      39.2697 * sx,
      31.8724 * sy,
      38.98 * sx,
      33.2132 * sy,
      (39.4588 + rightTongueX * 0.08) * sx,
      34.3693 * sy
    );

    p.cubicTo(
      (39.9377 + rightTongueX * 0.1) * sx,
      35.5254 * sy,
      (41.4032 + rightTongueX * 0.12) * sx,
      36.3066 * sy,
      (42.5058 + rightTongueX * 0.1) * sx,
      35.7148 * sy
    );

    p.cubicTo(
      (43.7808 + rightTongueX * 0.1) * sx,
      35.031 * sy,
      (43.8001 + rightTongueX * 0.05) * sx,
      32.9877 * sy,
      (43.0688 + baseX * 0.04) * sx,
      31.0124 * sy
    );

    p.cubicTo(
      (47.4047 + baseX * 0.06) * sx,
      32.6381 * sy,
      (49.8789 + baseX * 0.06) * sx,
      37.4927 * sy,
      (49.8896 + baseX * 0.05) * sx,
      42.1652 * sy
    );

    p.close();
    return p;
  });

  const innerPath = useDerivedValue(() => {
    const t = elapsed.value;

    // Same base frequency as outer — fixed phase offsets keep inner alive without beating
    const tipX = S(t, 0.9, 1.5, 0.25) + S(t, 1.8, 0.45, 0.85);
    const tipY = S(t, 0.75, 1.2, 1.15);

    const leftX = S(t, 1.0, 0.9, 1.55);
    const rightX = S(t, 0.95, 0.85, 0.75);

    const p = Skia.Path.Make();

    p.moveTo((41.1619 + tipX * 0.08) * sx, 47.8249 * sy);

    p.cubicTo(
      (39.7635 + leftX * 0.16) * sx,
      50.5961 * sy,
      (37.2484 + leftX * 0.18) * sx,
      52.7346 * sy,
      (34.3747 + leftX * 0.16) * sx,
      53.9089 * sy
    );

    p.cubicTo(
      34.0713 * sx,
      54.0329 * sy,
      33.7641 * sx,
      54.1465 * sy,
      33.4537 * sx,
      54.25 * sy
    );

    p.cubicTo(
      (30.3262 - leftX * 0.16) * sx,
      55.293 * sy,
      (26.895 - leftX * 0.18) * sx,
      55.0104 * sy,
      (24.0244 - leftX * 0.16) * sx,
      53.389 * sy
    );

    p.cubicTo(
      (21.878 - leftX * 0.18) * sx,
      52.1767 * sy,
      19.9048 * sx,
      50.1693 * sy,
      (18.6505 - leftX * 0.1) * sx,
      46.7649 * sy
    );

    p.cubicTo(
      17.3478 * sx,
      43.2289 * sy,
      (18.0907 - leftX * 0.1) * sx,
      38.2533 * sy,
      (20.0864 + tipX * 0.08) * sx,
      35.2379 * sy
    );

    p.cubicTo(
      20.1009 * sx,
      36.741 * sy,
      21.7142 * sx,
      37.8983 * sy,
      (23.2095 + tipX * 0.08) * sx,
      37.7487 * sy
    );

    p.cubicTo(
      (24.7052 + tipX * 0.1) * sx,
      37.5994 * sy,
      (25.9512 + tipX * 0.12) * sx,
      36.4279 * sy,
      (26.5703 + tipX * 0.12) * sx,
      35.0584 * sy
    );

    p.cubicTo(
      (27.1894 + tipX * 0.1) * sx,
      33.689 * sy,
      27.2815 * sx,
      32.1438 * sy,
      27.2695 * sx,
      30.6407 * sy
    );

    p.cubicTo(
      27.2578 * sx,
      29.1376 * sy,
      (27.1525 + tipX * 0.06) * sx,
      27.6217 * sy,
      (27.4127 + tipX * 0.1) * sx,
      26.1414 * sy
    );

    p.cubicTo(
      (27.6725 + tipX * 0.12) * sx,
      24.6611 * sy,
      (28.5759 + tipX * 0.18) * sx,
      (22.3271 - tipY * 0.2) * sy,
      (30.0793 + tipX * 0.22) * sx,
      (21.0 - tipY * 0.28) * sy
    );

    p.cubicTo(
      (28.68 + tipX * 0.16) * sx,
      (23.7323 - tipY * 0.12) * sy,
      (29.8217 + tipX * 0.1) * sx,
      (26.4189 - tipY * 0.05) * sy,
      (31.2432 + tipX * 0.08) * sx,
      28.6838 * sy
    );

    p.cubicTo(
      (32.6648 + rightX * 0.16) * sx,
      30.9488 * sy,
      (34.4946 + rightX * 0.18) * sx,
      31.7382 * sy,
      (35.4589 + rightX * 0.16) * sx,
      35.6115 * sy
    );

    p.cubicTo(
      (36.1355 + rightX * 0.12) * sx,
      38.3292 * sy,
      (34.7693 + rightX * 0.08) * sx,
      40.9331 * sy,
      (37.5016 + rightX * 0.12) * sx,
      41.6617 * sy
    );

    p.cubicTo(
      (39.6085 + rightX * 0.08) * sx,
      42.2235 * sy,
      41.2488 * sx,
      39.7621 * sy,
      (41.1447 + tipX * 0.08) * sx,
      38.3292 * sy
    );

    p.cubicTo(
      (42.4249 + tipX * 0.07) * sx,
      41.157 * sy,
      42.5603 * sx,
      45.0534 * sy,
      (41.1619 + tipX * 0.08) * sx,
      47.8249 * sy
    );

    p.close();
    return p;
  });

  const outerPaint = React.useMemo(() => {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color("#0F4CD0"));
    paint.setAntiAlias(true);
    return paint;
  }, []);

  const innerPaint = React.useMemo(() => {
    const paint = Skia.Paint();
    paint.setColor(Skia.Color("#FFFFFF"));
    paint.setAntiAlias(true);
    return paint;
  }, []);

  return (
    <View style={[{ width, height }, style]}>
      <Canvas style={{ width, height }}>
        <Path path={outerPath} paint={outerPaint} />
        <Path path={innerPath} paint={innerPaint} />
      </Canvas>
    </View>
  );
};

export default AnimatedFire;
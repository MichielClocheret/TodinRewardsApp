import React, { useEffect, useRef } from "react";
import { Alert, Linking, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

type CameraProps = {
  onScanned?: (value: string) => void;
};

const Camera = ({ onScanned }: CameraProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const hasRequestedPermission = useRef(false);

  useEffect(() => {
    if (hasRequestedPermission.current || permission === null) {
      return;
    }

    if (permission.granted) {
      return;
    }

    hasRequestedPermission.current = true;

    if (!permission.canAskAgain) {
      Alert.alert(
        'Camera access blocked',
        'Enable camera access in your phone settings to scan QR codes.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }

    Alert.alert(
      'Camera access',
      'May we use your camera to scan QR codes?',
      [
        { text: 'Not now', style: 'cancel' },
        { text: 'Allow', onPress: () => requestPermission() },
      ]
    );
  }, [permission, requestPermission]);

  if (!permission?.granted) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <CameraView
      facing="back"
      style={{ flex: 1 }}
      zoom={0.15}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={({ data }) => onScanned?.(data)}
    />
  );
};

export default Camera;

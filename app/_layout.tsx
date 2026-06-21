import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { registerForPushNotifications } from "./Notification/notifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "DMSans-Thin": require("../assets/font/DMSans-Thin.ttf"),
    "DMSans-ThinItalic": require("../assets/font/DMSans-ThinItalic.ttf"),
    "DMSans-ExtraLight": require("../assets/font/DMSans-ExtraLight.ttf"),
    "DMSans-ExtraLightItalic": require("../assets/font/DMSans-ExtraLightItalic.ttf"),
    "DMSans-Light": require("../assets/font/DMSans-Light.ttf"),
    "DMSans-LightItalic": require("../assets/font/DMSans-LightItalic.ttf"),
    "DMSans-Regular": require("../assets/font/DMSans-Regular.ttf"),
    "DMSans-Italic": require("../assets/font/DMSans-Italic.ttf"),
    "DMSans-Medium": require("../assets/font/DMSans-Medium.ttf"),
    "DMSans-MediumItalic": require("../assets/font/DMSans-MediumItalic.ttf"),
    "DMSans-SemiBold": require("../assets/font/DMSans-SemiBold.ttf"),
    "DMSans-SemiBoldItalic": require("../assets/font/DMSans-SemiBoldItalic.ttf"),
    "DMSans-Bold": require("../assets/font/DMSans-Bold.ttf"),
    "DMSans-BoldItalic": require("../assets/font/DMSans-BoldItalic.ttf"),
    "DMSans-ExtraBold": require("../assets/font/DMSans-ExtraBold.ttf"),
    "DMSans-ExtraBoldItalic": require("../assets/font/DMSans-ExtraBoldItalic.ttf"),
    "DMSans-Black": require("../assets/font/DMSans-Black.ttf"),
    "DMSans-BlackItalic": require("../assets/font/DMSans-BlackItalic.ttf"),
  });

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Stack screenOptions={{ headerShown: false, animation: "none" }} />
      </PersistGate>
    </Provider>
  );
}

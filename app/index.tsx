import { useRouter } from "expo-router";
import {
  clearAuthTokens,
  isStoredLoginValid,
} from "./API/authentication";
import LoadingScreen from "./components/LoadingScreen";
import { useAppDispatch } from "./hooks/reduxHooks";
import { setIsLoggedIn } from "./store/auth/slice";

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const checkLogin = async (): Promise<() => void> => {
    const isValid = await isStoredLoginValid();

    if (isValid) {
      dispatch(setIsLoggedIn(true));
      return () => router.replace("/screens/app");
    }

    dispatch(setIsLoggedIn(false));
    await clearAuthTokens();
    return () => router.replace("/screens/onboard");
  };

  return <LoadingScreen task={checkLogin} />;
}

import { useRouter } from "expo-router";
import {
  clearAuthTokens,
  getAccountInfo,
  isStoredLoginValid,
} from "./API/authentication";
import LoadingScreen from "./components/LoadingScreen";
import { checkInStreak } from "./API/streak";
import { useAppDispatch } from "./hooks/reduxHooks";
import { setIsLoggedIn } from "./store/auth/slice";

export default function Index() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const checkLogin = async (): Promise<() => void> => {
    const isValid = await isStoredLoginValid();

    if (isValid) {
      const checkIn = await checkInStreak();
      const accountInfoResult = await getAccountInfo();

      if (accountInfoResult.success && accountInfoResult.data) {
        dispatch(setIsLoggedIn(true));
        const streak = accountInfoResult.data.login_streak;
        if (checkIn.isNewCheckIn && typeof streak === "number") {
          return () => router.replace({ pathname: "/screens/streakCelebration", params: { streak: String(streak) } });
        }
        return () => router.replace("/screens/app");
      }
    }

    dispatch(setIsLoggedIn(false));
    await clearAuthTokens();
    return () => router.replace("/screens/onboard");
  };

  return <LoadingScreen task={checkLogin} />;
}

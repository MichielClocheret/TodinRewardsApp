import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { getReferral } from "@/app/API/referral";
import { setReferralData } from "@/app/store/referral/slice";

export const useReferralData = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.referral.data);

  useEffect(() => {
    if (data) return;
    getReferral().then((result) => {
      if (result.success && result.data) {
        dispatch(setReferralData(result.data));
      }
    });
  }, []);

  return data;
};

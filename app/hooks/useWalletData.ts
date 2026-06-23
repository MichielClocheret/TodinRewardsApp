import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { getWallet } from "@/app/API/wallet";
import { setWallets } from "@/app/store/wallet/slice";
import { parseNumericValue, sortWallets } from "@/app/utils/wallet";

export const useWalletData = () => {
  const dispatch = useAppDispatch();
  const wallets = useAppSelector((state) => state.wallet.wallets);

  useEffect(() => {
    if (wallets) return;
    getWallet().then((result) => {
      if (result.success && result.data) {
        dispatch(setWallets(sortWallets(result.data.data)));
      }
    });
  }, []);

  const totalBalance = (wallets ?? []).reduce((total, walletItem) => {
    const parsedValue = parseNumericValue(walletItem.value);
    return parsedValue !== null ? total + parsedValue : total;
  }, 0);

  return { wallets, totalBalance };
};

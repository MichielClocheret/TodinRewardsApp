import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Wallet } from "@/app/API/wallet";

type WalletState = {
  wallets: Wallet[] | null;
};

const initialState: WalletState = {
  wallets: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWallets: (state, action: PayloadAction<Wallet[]>) => {
      state.wallets = action.payload;
    },
    clearWallets: (state) => {
      state.wallets = null;
    },
  },
});

const { reducer, actions } = walletSlice;

export default reducer;
export const { setWallets, clearWallets } = actions;

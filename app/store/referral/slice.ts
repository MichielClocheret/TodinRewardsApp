import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Referral } from "@/app/API/referral";

type ReferralState = {
  data: Referral | null;
};

const initialState: ReferralState = {
  data: null,
};

const referralSlice = createSlice({
  name: "referral",
  initialState,
  reducers: {
    setReferralData: (state, action: PayloadAction<Referral>) => {
      state.data = action.payload;
    },
    clearReferralData: (state) => {
      state.data = null;
    },
  },
});

const { reducer, actions } = referralSlice;
export default reducer;
export const { setReferralData, clearReferralData } = actions;

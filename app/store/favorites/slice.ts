import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Shop } from "@/app/API/shop";

const initialState: Shop[] = [];

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Shop>) => {
      if (state.some((f) => f.id === action.payload.id)) {
        //filter maakt nieuwe array zonder die shop.
        // originele state wordt niet aangeraakt
        return state.filter((f) => f.id !== action.payload.id);
      }
      return [...state, action.payload];
    },
  },
});

const { reducer, actions } = favoritesSlice;

export default reducer;
export const { toggleFavorite } = actions;

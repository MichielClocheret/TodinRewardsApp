import { createSlice } from "@reduxjs/toolkit";

type SettingsState = {
  newsNotificationsEnabled: boolean;
};

const initialState: SettingsState = {
  newsNotificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleNewsNotifications: (state) => {
      state.newsNotificationsEnabled = !state.newsNotificationsEnabled;
    },
  },
});

const { reducer, actions } = settingsSlice;
export default reducer;
export const { toggleNewsNotifications } = actions;

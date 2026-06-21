import { combineReducers, configureStore } from "@reduxjs/toolkit";
import favoritesSlice from "./favorites/slice";
import settingsSlice from "./settings/slice";
import authSlice from "./auth/slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

//in store kan je meerdere slices hebben, 
// combine reducers voegt ze samen tot 1 root reducer
const rootReducer = combineReducers({
  favorites: favoritesSlice,
  settings: settingsSlice,
  auth: authSlice,
});


const persistedReducer = persistReducer(
  { key: "todinshop-state", storage: AsyncStorage, version: 1 },
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST, FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

//Geeft volledige state terug
export type RootState = ReturnType<typeof store.getState>;

//
export type AppDispatch = typeof store.dispatch;

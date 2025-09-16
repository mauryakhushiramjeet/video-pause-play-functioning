import { combineReducers } from "@reduxjs/toolkit";
import medialFilesReducer from "../store/mediaFileSchema";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { createStore } from "redux";
import { persistStore } from "redux-persist";
const persistConfig = {
  key: "root",
  storage,
  // storage
};
const rootReducer = combineReducers({
  mediaFile: medialFilesReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer);
export const persistor = persistStore(store);

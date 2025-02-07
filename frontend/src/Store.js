import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from "./Slices/UserSlice";
import adminAuthReducer from "./Slices/AdminSlice";
import userApi from "./Slices/UserApi";
import adminApi from "./Slices/AdminApi";

const store = configureStore({
  reducer: {
    userAuth: userAuthReducer,
    adminAuth: adminAuthReducer,
    [userApi.reducerPath]: userApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(adminApi.middleware), // Put custom middleware after default middleware
  devTools: true,
});

export default store;

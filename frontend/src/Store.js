import { configureStore } from "@reduxjs/toolkit";
import userAuthReducer from './Slices/UserSlice'
import adminAuthReducer from './Slices/AdminSlice'
import userApi from "./Slices/UserApi";

const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        adminAuth: adminAuthReducer,
        [userApi.reducerPath]: userApi.reducer 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware), // Put custom middleware after default middleware
    devTools: true
});



export default store;

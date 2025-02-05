import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./Slices/Apislice";

import userAuthReducer from './Slices/UserSlice'
import adminAuthReducer from './Slices/AdminSlice'

const store = configureStore({
    reducer: {
        userAuth: userAuthReducer,
        adminAuth: adminAuthReducer,
        [apiSlice.reducerPath]: apiSlice.reducer // Use apiSlice.reducerPath as the key
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware), // Put custom middleware after default middleware
    devTools: true
});



export default store;

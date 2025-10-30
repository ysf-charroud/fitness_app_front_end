import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice.js"
import authReducer from "./slices/authSlice.js"
const store = configureStore({
  reducer: {
    admin:adminReducer,
    auth: authReducer,
  },
});

export default store;

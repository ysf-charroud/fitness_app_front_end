import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./slices/adminSlice.js"
import authReducer from "./slices/authSlice.js";
import programsReducer from "./slices/programsSlice.js";
import gymsReducer from "./slices/gymsSlice.js";
import commentsReducer from "./slices/commentsSlice.js";

const store = configureStore({
  reducer: {
    admin:adminReducer,
    auth: authReducer,
    programs: programsReducer,
    gyms: gymsReducer,
    comments: commentsReducer,
  },
});

export default store;

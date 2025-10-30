import { configureStore } from "@reduxjs/toolkit";
import testReducer from "./slices/testSlice.js";
import adminReducer from "./slices/adminSlice.js"
const store = configureStore({
  reducer: {
    test: testReducer,
    admin:adminReducer,
  },
});

export default store
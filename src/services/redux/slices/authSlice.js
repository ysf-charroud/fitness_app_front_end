import api from "@/services/axios/axiosClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Helpers to persist auth across refreshes
const readJSON = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
};
const writeJSON = (key, value) => {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
};
const readString = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (_) {
    return null;
  }
};
const writeString = (key, value) => {
  try {
    if (!value) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch (_) {}
};

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, thunkAPI) => {
    try {
      const response = await api.get("/api/auth/me", { withCredentials: true });
      const userData = response.data;
      writeJSON("auth_user", userData);
      return userData;
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message || error?.message || "Failed to fetch user data";
      return thunkAPI.rejectWithValue({ status, message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: readJSON("auth_user"),
    token: readString("auth_token"),
    isLoading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      writeJSON("auth_user", action.payload || null);
    },
    setToken: (state, action) => {
      state.token = action.payload;
      writeString("auth_token", action.payload || "");
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      writeJSON("auth_user", null);
      writeString("auth_token", "");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
          state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
        writeJSON("auth_user", action.payload || null);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.error = payload?.message || action.error?.message || "Failed to fetch user data";
        if (payload?.status === 401) {
          state.user = null;
          state.token = null;
          writeJSON("auth_user", null);
          writeString("auth_token", "");
        }
      });
  },
});
export const { setUser, setToken, resetAuth } = authSlice.actions;
export default authSlice.reducer;
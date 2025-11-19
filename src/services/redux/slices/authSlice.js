import api from "@/services/axios/axiosClient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const SESSION_FLAG_KEY = "fitness_has_refresh_token";

const setSessionFlag = (value) => {
  if (typeof window === "undefined") return;
  try {
    if (value) sessionStorage.setItem(SESSION_FLAG_KEY, "true");
    else sessionStorage.removeItem(SESSION_FLAG_KEY);
  } catch (_) {}
};

export const hasStoredSession = () => {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_FLAG_KEY) === "true";
  } catch (_) {
    return false;
  }
};

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { dispatch, thunkAPI }) => {
    try {
      const response = await api.get("/api/auth/me", { withCredentials: true });
      const userData = response.data;
      if (userData?.token) {
        dispatch(setToken(userData.token));
      }
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
    user: null,
    token: null,
    isLoading: false,
    error: null,
    hydrated: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.hydrated = true;
      setSessionFlag(Boolean(action.payload));
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.error = null;
      state.hydrated = true;
      setSessionFlag(false);
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
        state.hydrated = true;
        setSessionFlag(true);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        const payload = action.payload;
        state.error = payload?.message || action.error?.message || "Failed to fetch user data";
        if (payload?.status === 401) {
          state.user = null;
          state.token = null;
          setSessionFlag(false);
        }
        state.hydrated = true;
      });
  },
});
export const { setUser, setToken, resetAuth } = authSlice.actions;
export default authSlice.reducer;

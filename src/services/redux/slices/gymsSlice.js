import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchGyms = createAsyncThunk(
  "gyms/fetchGyms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/gyms", { params: { page: 1, limit: 50 } });
      return Array.isArray(data) ? data : (data?.gyms || data?.data || []);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const gymsSlice = createSlice({
  name: "gyms",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGyms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGyms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGyms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch gyms";
      });
  },
});

export default gymsSlice.reducer;


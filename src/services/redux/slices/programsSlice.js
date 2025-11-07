import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/axios/axiosClient";

export const fetchPrograms = createAsyncThunk(
  "programs/fetchPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/api/programs", { params: { page: 1, limit: 50 } });
      // Backend paginate() returns { records: [...], page, limit, total, ... }
      return Array.isArray(data)
        ? data
        : (data?.records || data?.programs || data?.data || []);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const programsSlice = createSlice({
  name: "programs",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrograms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPrograms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch programs";
      });
  },
});

export default programsSlice.reducer;


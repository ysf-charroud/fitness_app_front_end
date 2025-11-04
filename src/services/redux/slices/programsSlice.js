import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchPrograms = createAsyncThunk(
  "programs/fetchPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/programs", { params: { page: 1, limit: 50 } });
      return Array.isArray(data) ? data : (data?.programs || data?.data || []);
    } catch (err) {r
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


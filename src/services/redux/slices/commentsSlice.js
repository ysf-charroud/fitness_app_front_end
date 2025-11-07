import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/services/api";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/comments");
      const arr = Array.isArray(data) ? data : (data?.data || data?.comments || []);
      return arr;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addComment = createAsyncThunk(
  "comments/addComment",
  async (content, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/comments", { content });
      // backend returns { success, data }
      return data?.data || data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/comments/${id}`);
      return { id, data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    items: [],
    loading: false,
    error: null,
    adding: false,
    deleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchComments.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchComments.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchComments.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to fetch comments"; })
      // add
      .addCase(addComment.pending, (s) => { s.adding = true; s.error = null; })
      .addCase(addComment.fulfilled, (s, a) => {
        s.adding = false;
        if (a.payload) s.items = [a.payload, ...s.items];
      })
      .addCase(addComment.rejected, (s, a) => { s.adding = false; s.error = a.payload || "Failed to add comment"; })
      // delete
      .addCase(deleteComment.pending, (s) => { s.deleting = true; s.error = null; })
      .addCase(deleteComment.fulfilled, (s, a) => {
        s.deleting = false;
        const id = a.payload?.id;
        if (id) s.items = s.items.filter((c) => String(c._id) !== String(id));
      })
      .addCase(deleteComment.rejected, (s, a) => { s.deleting = false; s.error = a.payload || "Failed to delete comment"; });
  },
});

export default commentsSlice.reducer;


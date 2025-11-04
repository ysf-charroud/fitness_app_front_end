// services/redux/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

// USERS
 const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/users");
      console.log(data);

      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const activateUser = createAsyncThunk(
  "admin/activateUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/activate`);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const deactivateUser = createAsyncThunk(
  "admin/deactivateUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/deactivate`);
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/users/${userId}`);
      return { id: userId, data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// PROGRAMS
 const fetchPrograms = createAsyncThunk(
  "admin/fetchPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("admin/programs");
      // Assurez-vous que data contient bien un tableau
      return data.programs || data.data || data; // Essayez différentes possibilités
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const updateProgramStatus = createAsyncThunk(
  "admin/updateProgramStatus",
  async ({ id, status }, { rejectWithValue }) => {
    console.log("ggggg",status)
    try {
      const { data } = await api.put(`/admin/programs/${id}/status?status=${status}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 

 const deleteProgram = createAsyncThunk(
  "admin/deleteProgram",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/programs/${id}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// COACHES & GYMS (assumed endpoints /coaches and /gyms)
 const fetchCoaches = createAsyncThunk(
  "admin/fetchCoaches",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/coaches");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const fetchGyms = createAsyncThunk(
  "admin/fetchGyms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/gyms");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// STATS
 const fetchStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/stats");
      return data;
    } catch (err) {
      console.error("🔴 Fetch Stats Error:", err);
      return rejectWithValue(
        err.response?.data || { message: err.message } || "Unknown error"
      );
    }
  }
);

 const approveGym = createAsyncThunk(
  "admin/approveGym",
  async (gymId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/gyms/${gymId}/approve`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const rejectGym = createAsyncThunk(
  "admin/rejectGym",
  async (gymId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/gyms/${gymId}/reject`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const deleteGym = createAsyncThunk(
  "admin/deleteGym",
  async (gymId, { rejectWithValue }) => {
    try {
      await api.delete(`/gyms/${gymId}`);
      return gymId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
// transaction
 const fetchDashboardStats = createAsyncThunk(
  "admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/stats");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const fetchRevenueChart = createAsyncThunk(
  "admin/fetchRevenueChart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/revenue-chart");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const fetchRoleDistribution = createAsyncThunk(
  "admin/fetchRoleDistribution",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/role-distribution");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const fetchLastTransactions = createAsyncThunk(
  "admin/fetchLastTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/last-transactions");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

 const fetchBestPrograms = createAsyncThunk(
  "admin/fetchBestPrograms",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/best-programs");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
 const fetchRevenueStats = createAsyncThunk(
  "admin/fetchRevenueStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/revenue-stats");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    usersLoading: false,
    programs: [],
    programsLoading: false,
    coaches: [],
    gyms: [],
    stats: null,
    revenueChart: [],      
    roleDistribution: [],  
    lastTransactions: [],    
    bestPrograms: [],
    loading:false,   
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // users
    builder
      .addCase(fetchUsers.pending, (s) => {
        s.usersLoading = true;
        s.error = null;
      })
      .addCase(fetchUsers.fulfilled, (s, a) => {
        s.usersLoading = false;
        s.users = a.payload.users;
      })
      .addCase(fetchUsers.rejected, (s, a) => {
        s.usersLoading = false;
        s.error = a.payload;
      });

    builder.addCase(activateUser.fulfilled, (s, a) => {
      s.users = s.users.map((u) => (u._id === a.payload._id ? a.payload : u));
    });
    builder.addCase(deactivateUser.fulfilled, (s, a) => {
      s.users = s.users.map((u) => (u._id === a.payload._id ? a.payload : u));
    });
    builder.addCase(deleteUser.fulfilled, (s, a) => {
      s.users = s.users.filter((u) => u._id !== a.payload.id);
    });

    // programs
    builder
      .addCase(fetchPrograms.pending, (s) => {
        s.programsLoading = true;
        s.error = null;
      })
      .addCase(fetchPrograms.fulfilled, (s, a) => {
        s.programsLoading = false;
        s.programs = a.payload;
      })
      .addCase(fetchPrograms.rejected, (s, a) => {
        s.programsLoading = false;
        s.error = a.payload;
      });

    builder.addCase(updateProgramStatus.fulfilled, (s, a) => {
      s.programs = s.programs.map((p) =>
        p._id === a.payload._id ? a.payload : p
      );
    });
    builder.addCase(deleteProgram.fulfilled, (s, a) => {
  s.programs = s.programs.filter(p => p._id !== a.payload._id);
});

    // coaches & gyms
    builder.addCase(fetchCoaches.fulfilled, (s, a) => {
      s.coaches = a.payload;
    });
    builder.addCase(fetchGyms.fulfilled, (s, a) => {
      console.log(a.payload)
      s.gyms = a.payload;
    });

    // stats
    builder
      .addCase(fetchStats.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchStats.fulfilled, (s, a) => {
        s.loading = false;
        s.stats = a.payload;
        s.error = null;
        console.log("🟢 Stats fetched successfully:", a.payload);
      })
      .addCase(fetchStats.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
        console.log("🔴 Stats fetch failed:", a.payload);
      });
    builder
       .addCase(approveGym.fulfilled, (s, a) => {
    s.gyms = s.gyms.map(gym => gym._id === a.payload._id ? a.payload : gym);
  })
  .addCase(rejectGym.fulfilled, (s, a) => {
    s.gyms = s.gyms.map(gym => gym._id === a.payload._id ? a.payload : gym);
  })
  .addCase(deleteGym.fulfilled, (s, a) => {
    s.gyms = s.gyms.filter((g) => g._id !== a.payload);
  })


.addCase(fetchDashboardStats.fulfilled, (s,a) => {
  s.stats =a.payload;
})
.addCase(fetchRevenueChart.fulfilled, (s,a) => {
  s.revenueChart =a.payload;
})

.addCase(fetchRoleDistribution.fulfilled, (s,a) => {
  s.roleDistribution =a.payload;
})
.addCase(fetchLastTransactions.fulfilled, (s,a) => {
  s.lastTransactions =a.payload;
})
.addCase(fetchBestPrograms.fulfilled, (s,a) => {
  s.bestPrograms =a.payload;
})
.addCase(fetchRevenueStats.fulfilled, (s, a) => {
  s.revenueStats = a.payload;
})
    
  },
});

export default adminSlice.reducer;
export {
  fetchUsers,
  activateUser,
  deactivateUser,
  deleteUser,
  fetchPrograms,
  updateProgramStatus,
  deleteProgram,
  fetchCoaches,
  fetchGyms,
  fetchStats,
  approveGym,
  rejectGym,
  deleteGym,
  fetchDashboardStats,
  fetchRevenueChart,
  fetchRoleDistribution,
  fetchLastTransactions,
  fetchBestPrograms,
  fetchRevenueStats,
};
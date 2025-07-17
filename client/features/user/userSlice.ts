import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../lib/api";

export const updateProfile = createAsyncThunk(
  "user/update",
  async (data: any, thunkAPI) => {
    try {
      const res = await api.put("/auth/me", data);
      return res.data.user;
    } catch {
      return thunkAPI.rejectWithValue("Failed to update profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    updating: false,
    error: null as string | null,
    user: {
      firstName: "",
      lastName: "",
      birthDate: "",
      avatar: "",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (s) => {
        s.updating = true;
        s.error = null;
      })
      .addCase(updateProfile.fulfilled, (s, action) => {
        // s.updating = true;
        s.user = action.payload;
      })
      .addCase(updateProfile.rejected, (s, action) => {
        s.updating = false;
        s.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;

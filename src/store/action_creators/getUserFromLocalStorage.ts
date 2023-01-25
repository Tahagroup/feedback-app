import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserFromLocalStorage = createAsyncThunk(
  "GET/localstorage/user",
  async (_, { rejectWithValue }) => {
    try {
      const userState = await JSON.parse(
        localStorage.getItem("currentUser") ?? "{notFound:true}"
      );
      return userState;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

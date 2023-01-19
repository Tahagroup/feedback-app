import { createAsyncThunk } from "@reduxjs/toolkit";

export const getIssues = createAsyncThunk(
  "GET/issues",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/issues").then((data) => data.json());
      if (response.message) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

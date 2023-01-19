import { createAsyncThunk } from "@reduxjs/toolkit";

export const getLabels = createAsyncThunk(
  "GET/labels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/labels").then((data) => data.json());
      if (response.message) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

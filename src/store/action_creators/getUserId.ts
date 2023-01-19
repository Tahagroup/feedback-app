import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUserId = createAsyncThunk<
  any,
  { userId: string },
  {
    rejectValue: any;
  }
>("GET/user", async ({ userId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/users/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    if (response.message) {
      throw new Error(response.message);
    }
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

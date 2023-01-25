import { createAsyncThunk } from "@reduxjs/toolkit";

export const postLabel = createAsyncThunk<
  any,
  { name: string; color: number },
  {
    rejectValue: any;
  }
>("POST/label", async ({ name, color }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/labels`, {
      method: "POST",
      body: JSON.stringify({
        name,
        color,
      }),
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

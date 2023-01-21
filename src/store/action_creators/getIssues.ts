import { createAsyncThunk } from "@reduxjs/toolkit";

export const getIssues = createAsyncThunk<
  any,
  { offset: number },
  {
    rejectValue: any;
  }
>("GET/issues", async ({ offset }, { rejectWithValue }) => {
  try {
    const response = await fetch(`issues/?offset=${offset}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {
      if (data.ok) {
        return data.json();
      } else {
        throw new Error("End of Issues");
      }
    });
    if (response.message) {
      throw new Error(response.message);
    }
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

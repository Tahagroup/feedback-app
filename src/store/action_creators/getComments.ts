import { createAsyncThunk } from "@reduxjs/toolkit";

export const getComments = createAsyncThunk<
  any,
  { issueId: string },
  {
    rejectValue: any;
  }
>("GET/comments", async ({ issueId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/issues/${issueId}/comments`, {
      method: "GET",
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

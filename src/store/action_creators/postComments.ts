import { createAsyncThunk } from "@reduxjs/toolkit";

export const postComments = createAsyncThunk<
  any,
  { issueId: string; text: string },
  {
    rejectValue: any;
  }
>("POST/comment", async ({ issueId, text }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/issues/${issueId}/comments`, {
      method: "POST",
      body: JSON.stringify({
        text,
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

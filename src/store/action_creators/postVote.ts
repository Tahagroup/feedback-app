import { createAsyncThunk } from "@reduxjs/toolkit";

export const postVote = createAsyncThunk<
  any,
  { issueId: string; type: string },
  {
    rejectValue: any;
  }
>("POST/vote", async ({ issueId, type }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/issues/${issueId}/votes`, {
      method: "POST",
      body: JSON.stringify({
        type,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {
      if (data.ok) {
        return { type, issueId };
      }
      return data.json();
    });
    if (response.message) {
      throw new Error(response.message);
    }
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

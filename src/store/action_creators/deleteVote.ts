import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteVote = createAsyncThunk<
  any,
  { issueId: string },
  {
    rejectValue: any;
  }
>("DELETE/vote", async ({ issueId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/issues/${issueId}/votes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => {
      if (data.ok) {
        return { issueId };
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

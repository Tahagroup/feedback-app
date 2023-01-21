import { createAsyncThunk } from "@reduxjs/toolkit";

export const patchIssue = createAsyncThunk<
  any,
  {
    issueId: string;
    status: string;
  },
  {
    rejectValue: any;
  }
>("PATCH/issue", async ({ issueId, status }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/issues/${issueId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
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

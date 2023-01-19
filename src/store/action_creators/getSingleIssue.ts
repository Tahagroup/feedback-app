import { createAsyncThunk } from "@reduxjs/toolkit";

export const getSingleIssue = createAsyncThunk<
  any,
  { issueId: string },
  {
    rejectValue: any;
  }
>("GET/issue", async ({ issueId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/issues/${issueId}`, {
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

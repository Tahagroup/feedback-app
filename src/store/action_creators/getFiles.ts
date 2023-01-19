import { createAsyncThunk } from "@reduxjs/toolkit";

export const getFiles = createAsyncThunk<
  any,
  { issueId: string },
  {
    rejectValue: any;
  }
>("GET/files", async ({ issueId }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/issues/${issueId}/files`, {
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

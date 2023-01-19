import { createAsyncThunk } from "@reduxjs/toolkit";

export const postVote = createAsyncThunk<
  any,
  { type: string; issueId: string },
  {
    rejectValue: any;
  }
>(
  //action type string
  "POST/vote",
  // callback function (referred to as a payloadCreator)
  async ({ type, issueId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/issues/${issueId}/votes`, {
        method: "POST",
        body: JSON.stringify({
          type,
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
  }
);

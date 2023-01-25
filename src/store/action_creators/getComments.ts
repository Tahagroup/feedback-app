import { createAsyncThunk } from "@reduxjs/toolkit";

export const getComments = createAsyncThunk<
  any,
  { issueId: string; offset: number },
  {
    rejectValue: any;
    getState: () => any;
  }
>(
  "GET/comments",
  async ({ issueId, offset }, { rejectWithValue, getState }) => {
    try {
      // const currentOffset = (getState() as { issuesSlice: any }).issuesSlice
      //   .commentsPageOffset;

      const response = await fetch(
        `/issues/${issueId}/comments?offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((data) => data.json());
      if (response.length === 0) {
        throw new Error("End of Comments");
      }
      if (response.message) {
        throw new Error(response.message);
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

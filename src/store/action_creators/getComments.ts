import { createAsyncThunk } from "@reduxjs/toolkit";
import { issueActions } from "../slices/IssuesSlice";

export const getComments = createAsyncThunk<
  any,
  { issueId: string; offset: number },
  {
    rejectValue: any;
    getState: () => any;
  }
>(
  "GET/comments",
  async ({ issueId, offset }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { thereIsMoreData } = (getState() as { issuesSlice: any })
        .issuesSlice;
      if (!thereIsMoreData) {
        throw new Error("End of Comments");
      }
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
        dispatch(issueActions.setEndOfData());
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

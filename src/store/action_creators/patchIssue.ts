import { createAsyncThunk } from "@reduxjs/toolkit";

export const patchIssue = createAsyncThunk<
  any,
  {
    issueId: string;
    title: string;
    description: string;
    status: string;
    type: string;
  },
  {
    rejectValue: any;
  }
>(
  "PATCH/issue",
  async (
    { issueId, title, description, status, type },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/issues/${issueId}`, {
        method: "PATCH",
        body: JSON.stringify(bodyMaker(title, description, status, type)),
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

function bodyMaker(
  title: string,
  description: string,
  status: string,
  type: string
) {
  let body: any = {};
  if (title) {
    body.title = title;
  }
  if (description) {
    body.description = description;
  }
  if (status) {
    body.status = status;
  }
  if (type) {
    body.type = type;
  }
  return body;
}

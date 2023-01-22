import { createAsyncThunk } from "@reduxjs/toolkit";

export const postIssues = createAsyncThunk<
  any,
  {
    title: string;
    description: string;
    labelIds: string[];
    fileIds: string[];
    type: "Bug" | "Suggestion";
  },
  {
    rejectValue: any;
  }
>(
  //action type string
  "POST/issue",
  // callback function (referred to as a payloadCreator)
  async (
    { title, description, labelIds, fileIds, type },
    { rejectWithValue }
  ) => {
    try {
      const response = postRetry(
        {
          title,
          description,
          labelIds,
          fileIds,
          type,
        },
        2
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

async function postRetry(body: any, tries: number) {
  const triesLeft = tries - 1;
  if (!triesLeft) {
    throw Error(
      "Retried two times, maybe there is a problem with your internet connection"
    );
  }
  await fetch(`/issues`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      return data.json();
    })
    .catch((error) => {
      return () => postRetry(body, triesLeft);
    });
}

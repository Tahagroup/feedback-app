import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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
      // let retryRemaining = 1;
      // let response = await issuePoster({
      //   title,
      //   description,
      //   labelIds,
      //   fileIds,
      //   type,
      // });
      // console.log(response);
      // if (response.status === 500 && retryRemaining !== 0) {
      //   retryRemaining--;
      //   response = await issuePoster({
      //     title,
      //     description,
      //     labelIds,
      //     fileIds,
      //     type,
      //   });
      // }
      // const response = await axios.post(`/issues`, {
      //   title,
      //   description,
      //   labelIds,
      //   fileIds,
      //   type,
      // });
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
      // const response = await fetch(`/issues`, {
      //   method: "POST",
      //   body: JSON.stringify({
      //     title,
      //     description,
      //     labelIds,
      //     fileIds,
      //     type,
      //   }),
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // }).then((data) => data.json());
      // if (response.data.message) {
      //   throw new Error(response.data.message);
      // }
      // returns new issue id
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

async function postRetry(body: any, tries: number) {
  const triesLeft = tries - 1;
  console.log(triesLeft);

  if (!triesLeft) {
    throw Error(
      "Retried two times, maybe there is a problem with your internet connection"
    );
  }
  await fetch(`/issuesس`, {
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

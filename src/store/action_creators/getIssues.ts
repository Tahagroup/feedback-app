import { createAsyncThunk } from "@reduxjs/toolkit";

export const getIssues = createAsyncThunk<
  string,
  { offset: number; sortBy: string },
  {
    rejectValue: any;
  }
>("GET/issues", async ({ offset, sortBy }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `issues/?sortBy=${sortBy ?? "Date"}&sortType=DESC&offset=${offset}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (data) => {
      if (data.ok) {
        const receivedData = await data.json();
        if (receivedData.length === 0) {
          throw new Error("End of Issues");
        }
        return receivedData;
      }
    });
    if (response.message) {
      throw new Error(response.message);
    }
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

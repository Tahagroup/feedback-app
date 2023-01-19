import { createAsyncThunk } from "@reduxjs/toolkit";

export const getLoggedinUser = createAsyncThunk<
  any,
  { email: string; password: string },
  {
    rejectValue: any;
  }
>(
  //action type string
  "POST/login",
  // callback function (referred to as a payloadCreator)
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
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

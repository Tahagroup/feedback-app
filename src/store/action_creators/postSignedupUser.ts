import { createAsyncThunk } from "@reduxjs/toolkit";

export const postSignedupUser = createAsyncThunk<
  any,
  { username: string; email: string; password: string },
  {
    rejectValue: any;
  }
>("POST/signup", async ({ email, password, username }, { rejectWithValue }) => {
  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: username,
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
});

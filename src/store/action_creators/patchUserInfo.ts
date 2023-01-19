import { createAsyncThunk } from "@reduxjs/toolkit";

export const patchUserInfo = createAsyncThunk<
  any,
  { userId: string; name: string; email: string },
  {
    rejectValue: any;
  }
>("PATCH/user", async ({ userId, name, email }, { rejectWithValue }) => {
  try {
    const response = await fetch(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
        email,
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

import { createAsyncThunk } from "@reduxjs/toolkit";

export const setUserOnLocalStorage = createAsyncThunk<
  any,
  { userInfo: any },
  any
>("SET/localstorage/user", ({ userInfo }, { rejectWithValue }) => {
  try {
    localStorage.setItem("currentUser", JSON.stringify(userInfo));
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

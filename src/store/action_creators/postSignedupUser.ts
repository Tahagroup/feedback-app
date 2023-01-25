import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { setUserOnLocalStorage } from "./setUserOnLocalStorage";

export const postSignedupUser = createAsyncThunk<
  any,
  { username: string; email: string; password: string },
  {
    rejectValue: any;
    dispatch: AppDispatch;
  }
>(
  "POST/signup",
  async ({ email, password, username }, { rejectWithValue, dispatch }) => {
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
      dispatch(setUserOnLocalStorage({ userInfo: response }));

      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

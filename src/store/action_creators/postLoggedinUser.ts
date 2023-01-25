import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "../store";
import { setUserOnLocalStorage } from "./setUserOnLocalStorage";

export const postLoggedinUser = createAsyncThunk<
  any,
  { email: string; password: string },
  {
    rejectWithValue: any;
    dispatch: AppDispatch;
  }
>(
  //action type string
  "POST/login",
  // callback function (referred to as a payloadCreator)
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    // const dispatch = useDispatch<AppDispatch>();
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
      dispatch(setUserOnLocalStorage({ userInfo: response }));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

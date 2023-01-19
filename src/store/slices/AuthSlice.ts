import { createSlice } from "@reduxjs/toolkit";
import { getLoggedinUser } from "../action_creators/getLoggedinUser";
import { getUserId } from "../action_creators/getUserId";
import { patchUserInfo } from "../action_creators/patchUserInfo";
import { postSignedupUser } from "../action_creators/postSignedupUser";
const AuthSlice = createSlice({
  name: "authSlice",
  initialState: {
    currentUser: null,
    isAdmin: false,
    admins: ["4"], // initial admin
    userInfos: [],
    isLoading: false,
    errorMsg: null,
  },
  reducers: {
    //define possible actions(= define reducers which return actions)
    logoutUser(state) {
      state.currentUser = null;
      state.isLoading = false;
      state.errorMsg = null;
    },
  },
  //handles asynchronous requests:
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(getLoggedinUser.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.errorMsg = null;
      if (action.payload.name === "admin") {
        state.isAdmin = true;
      } else {
        state.isAdmin = false;
      }
    });
    builder.addCase(getLoggedinUser.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(getLoggedinUser.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.currentUser = null;
      state.errorMsg = action.payload;
    });
    // signup user
    builder.addCase(postSignedupUser.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.errorMsg = null;
    });
    builder.addCase(postSignedupUser.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(postSignedupUser.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.currentUser = null;
      state.errorMsg = action.payload;
    });
    // get user info
    builder.addCase(getUserId.fulfilled, (state: any, action: any) => {
      state.userInfos.push(action.payload);
    });
    builder.addCase(getUserId.pending, (state: any, action: any) => {
      // state.isLoading = true;
    });
    builder.addCase(getUserId.rejected, (state: any, action: any) => {
      // state.isLoading = false;
      state.userInfo = null;
    });
    // patch user info
    builder.addCase(patchUserInfo.fulfilled, (state: any, action: any) => {
      state.currentUser = action.payload;
      state.userInfos.push(action.payload);
    });
    builder.addCase(patchUserInfo.pending, (state: any, action: any) => {
      // state.isLoading = true;
    });
    builder.addCase(patchUserInfo.rejected, (state: any, action: any) => {
      // state.isLoading = false;
    });
  },
});

//exporting actions to execute them in the components
export const authActions = AuthSlice.actions;
//exporting slice
export default AuthSlice;

///////////////////////////////////////////////////////////////////

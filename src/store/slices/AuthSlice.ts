import { createSlice } from "@reduxjs/toolkit";
import { postLoggedinUser } from "../action_creators/postLoggedinUser";
import { getUserFromLocalStorage } from "../action_creators/getUserFromLocalStorage";
import { getUserId } from "../action_creators/getUserId";
import { patchUserInfo } from "../action_creators/patchUserInfo";
import { postSignedupUser } from "../action_creators/postSignedupUser";
import { setUserOnLocalStorage } from "../action_creators/setUserOnLocalStorage";
const AuthSlice = createSlice({
  name: "authSlice",
  initialState: {
    currentUser: null,
    isAdmin: false,
    adminsList: [2], // initial admin
    userInfos: [],
    foundUser: null,
    isLoading: false,
    errorMsg: null,
  },
  reducers: {
    //define possible actions(= define reducers which return actions)
    logoutUser(state) {
      state.currentUser = null;
      state.isAdmin = false;
      state.isLoading = false;
      state.errorMsg = null;
      state.foundUser = null;
      localStorage.clear();
    },
    demoteUser(state, action) {
      state.adminsList = state.adminsList.filter(
        (admin) => admin !== action.payload
      );
    },
    promoteUser(state, action) {
      state.adminsList.push(action.payload);
    },
    // getUserStateFromLocalStorage(state) {
    //   const userState = JSON.parse(
    //     localStorage.getItem("currentUser") ?? "null"
    //   );
    //   if (!userState) {
    //     return;
    //   }
    //   state.currentUser = userState.currentUser;
    //   state.isAdmin = userState.isAdmin;
    // },
  },
  //handles asynchronous requests:
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    // login user
    builder.addCase(postLoggedinUser.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.errorMsg = null;
      if (state.adminsList.includes(action.payload.id)) {
        state.isAdmin = true;
      } else {
        state.isAdmin = false;
      }
    });
    builder.addCase(postLoggedinUser.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(postLoggedinUser.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
    });
    // signup user
    builder.addCase(postSignedupUser.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.currentUser = action.payload;
      state.errorMsg = null;
      if (state.adminsList.includes(action.payload.id)) {
        state.isAdmin = true;
      } else {
        state.isAdmin = false;
      }
    });
    builder.addCase(postSignedupUser.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(postSignedupUser.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
    });
    // get user info
    builder.addCase(getUserId.fulfilled, (state: any, action: any) => {
      state.userInfos.push(action.payload);
      state.foundUser = action.payload;
    });
    builder.addCase(getUserId.pending, (state: any, action: any) => {
      // state.isLoading = true;
    });
    builder.addCase(getUserId.rejected, (state: any, action: any) => {
      // state.isLoading = false;
      state.userInfo = null;
      state.foundUser = null;
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

    // get user info from local storage
    builder.addCase(
      getUserFromLocalStorage.fulfilled,
      (state: any, action: any) => {
        // state.isLoading = false;
        state.currentUser = action.payload;
        state.errorMsg = null;

        if (state.adminsList.includes(action.payload.id)) {
          state.isAdmin = true;
        } else {
          state.isAdmin = false;
        }
      }
    );
    builder.addCase(
      getUserFromLocalStorage.pending,
      (state: any, action: any) => {
        // state.isLoading = true;
      }
    );
    builder.addCase(
      getUserFromLocalStorage.rejected,
      (state: any, action: any) => {
        // state.isLoading = false;
      }
    );
    // set user info on local storage
    builder.addCase(
      setUserOnLocalStorage.fulfilled,
      (state: any, action: any) => {
        //
      }
    );
    builder.addCase(
      setUserOnLocalStorage.pending,
      (state: any, action: any) => {
        //
      }
    );
    builder.addCase(
      setUserOnLocalStorage.rejected,
      (state: any, action: any) => {
        //
      }
    );
  },
});

//exporting actions to execute them in the components
export const authActions = AuthSlice.actions;
//exporting slice
export default AuthSlice;

///////////////////////////////////////////////////////////////////

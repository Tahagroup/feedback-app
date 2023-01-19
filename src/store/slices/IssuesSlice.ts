import { createSlice } from "@reduxjs/toolkit";
import { getComments } from "../action_creators/getComments";
import { getFiles } from "../action_creators/getFiles";
import { getIssues } from "../action_creators/getIssues";
import { getLabels } from "../action_creators/getLabels";
import { getSingleIssue } from "../action_creators/getSingleIssue";
import { postComments } from "../action_creators/postComments";
import { postIssues } from "../action_creators/postIssues";
import { postVote } from "../action_creators/postVote";
const IssuesSlice = createSlice({
  name: "issuesSlice",
  initialState: {
    issues: [],
    visitingIssue: [],
    labels: [],
    comments: [],
    files: [],
    isLoading: false,
    errorMsg: null,
  },
  reducers: {
    //define possible actions(= define reducers which return actions)
    // loginUser(state, action) {
    //   state.currentUser = action.payload;
    // },
  },
  //handles asynchronous requests:
  extraReducers: (builder) => {
    // get issues
    builder.addCase(getIssues.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.issues = action.payload;
      state.errorMsg = null;
    });
    builder.addCase(getIssues.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(getIssues.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.errorMsg = action.payload.message;
    });
    // get single issue
    builder.addCase(getSingleIssue.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.visitingIssue = action.payload;
    });
    builder.addCase(getSingleIssue.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(getSingleIssue.rejected, (state: any, action: any) => {
      state.isLoading = false;
    });
    // post issues
    builder.addCase(postIssues.fulfilled, (state: any, action: any) => {
      // state.isLoading = false;
      // state.issues = action.payload;
      // state.errorMsg = null;
    });
    builder.addCase(postIssues.pending, (state: any, action: any) => {
      // state.isLoading = true;
    });
    builder.addCase(postIssues.rejected, (state: any, action: any) => {
      // state.isLoading = false;
      // state.errorMsg = action.payload.message;
    });

    // post vote
    builder.addCase(postVote.fulfilled, (state: any, action: any) => {
      // TODO: need to update redux store to update UI
      console.log(state);
      console.log(action.payload);

      state.issues = action.payload;
    });
    builder.addCase(postVote.pending, (state: any, action: any) => {
      //
    });
    builder.addCase(postVote.rejected, (state: any, action: any) => {
      //
    });
    // get labels
    builder.addCase(getLabels.fulfilled, (state: any, action: any) => {
      state.labels = action.payload;
    });
    builder.addCase(getLabels.pending, (state: any, action: any) => {
      //
    });
    builder.addCase(getLabels.rejected, (state: any, action: any) => {
      //
    });
    // get comments
    builder.addCase(getComments.fulfilled, (state: any, action: any) => {
      state.comments = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getComments.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(getComments.rejected, (state: any, action: any) => {
      state.isLoading = false;
    });
    // post comments
    builder.addCase(postComments.fulfilled, (state: any, action: any) => {
      // state.comments = action.payload;
    });
    builder.addCase(postComments.pending, (state: any, action: any) => {
      //
    });
    builder.addCase(postComments.rejected, (state: any, action: any) => {
      //
    });
    // get files
    builder.addCase(getFiles.fulfilled, (state: any, action: any) => {
      state.files = action.payload;
    });
    builder.addCase(getFiles.pending, (state: any, action: any) => {
      //
    });
    builder.addCase(getFiles.rejected, (state: any, action: any) => {
      //
    });
  },
});

//exporting actions to execute them in the components
export const issueActions = IssuesSlice.actions;
//exporting slice
export default IssuesSlice;

///////////////////////////////////////////////////////////////////

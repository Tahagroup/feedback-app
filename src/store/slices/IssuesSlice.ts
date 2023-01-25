import { createSlice } from "@reduxjs/toolkit";
import { deleteVote } from "../action_creators/deleteVote";
import { getComments } from "../action_creators/getComments";
import { getFiles } from "../action_creators/getFiles";
import { getIssues } from "../action_creators/getIssues";
import { getIssuesAndReplace } from "../action_creators/getIssuesAndReplace";
import { getLabels } from "../action_creators/getLabels";
import { getSingleIssue } from "../action_creators/getSingleIssue";
import { patchIssue } from "../action_creators/patchIssue";
import { patchVote } from "../action_creators/patchVote";
import { postComments } from "../action_creators/postComments";
import { postIssues } from "../action_creators/postIssues";
import { postVote } from "../action_creators/postVote";
const IssuesSlice = createSlice({
  name: "issuesSlice",
  initialState: {
    issues: [],
    visitingIssue: null,
    labels: [],
    comments: [],
    files: [],
    isLoading: false,
    errorMsg: null,
    commentsPageOffset: 0,
  },
  reducers: {
    //define possible actions(= define reducers which return actions)
  },
  //handles asynchronous requests:
  extraReducers: (builder) => {
    // get issues
    builder.addCase(getIssues.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      state.errorMsg = null;
      state.issues.push(...action.payload);
      // state.issues = action.payload;
    });
    builder.addCase(getIssues.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(getIssues.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
    });
    // get issues and replace prev state
    builder.addCase(
      getIssuesAndReplace.fulfilled,
      (state: any, action: any) => {
        state.isLoading = false;
        state.errorMsg = null;
        state.issues = action.payload;
        state.commentsPage = 0;
      }
    );
    builder.addCase(getIssuesAndReplace.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(getIssuesAndReplace.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
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
    // patch issue
    builder.addCase(patchIssue.fulfilled, (state: any, action: any) => {
      state.isLoading = false;
      // console.log(action.payload);
      const targetIssueIndex = state.issues.findIndex(
        (issue: Issue) => issue.id === action.payload.id
      );
      state.issues[targetIssueIndex].status = action.payload.status;
      // state.issues = action.payload.filter();
      // state.errorMsg = null;
    });
    builder.addCase(patchIssue.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(patchIssue.rejected, (state: any, action: any) => {
      state.isLoading = false;
      // state.errorMsg = action.payload.message;
    });

    // post vote
    builder.addCase(postVote.fulfilled, (state: any, action: any) => {
      const changedIssueIndex = state.issues.findIndex(
        (issue: Issue) => issue.id === +action.payload.issueId
      );
      const voteType =
        action.payload.type === "Up"
          ? {
              upVoteCount: state.issues[changedIssueIndex].upVoteCount + 1,
            }
          : {
              downVoteCount: state.issues[changedIssueIndex].downVoteCount + 1,
            };
      const changedIssue = {
        ...state.issues[changedIssueIndex],
        ...voteType,
        ...{ vote: { type: action.payload.type } },
      };

      const newIssues = [
        ...state.issues.slice(0, changedIssueIndex),
        changedIssue,
        ...state.issues.slice(changedIssueIndex + 1),
      ];
      state.issues = newIssues;
    });
    builder.addCase(postVote.pending, (state: any, action: any) => {
      //
    });
    builder.addCase(postVote.rejected, (state: any, action: any) => {
      //
    });
    // patch vote
    builder.addCase(patchVote.fulfilled, (state: any, action: any) => {
      const changedIssueIndex = state.issues.findIndex(
        (issue: Issue) => issue.id === +action.payload.issueId
      );
      const voteType =
        action.payload.type === "Up"
          ? {
              upVoteCount: state.issues[changedIssueIndex].upVoteCount + 1,
              downVoteCount: state.issues[changedIssueIndex].downVoteCount - 1,
            }
          : {
              upVoteCount: state.issues[changedIssueIndex].upVoteCount - 1,
              downVoteCount: state.issues[changedIssueIndex].downVoteCount + 1,
            };
      const changedIssue = {
        ...state.issues[changedIssueIndex],
        ...voteType,
        ...{ vote: { type: action.payload.type } },
      };

      const newIssues = [
        ...state.issues.slice(0, changedIssueIndex),
        changedIssue,
        ...state.issues.slice(changedIssueIndex + 1),
      ];
      state.issues = newIssues;
    });
    builder.addCase(patchVote.pending, (state: any, action: any) => {
      //
    });
    builder.addCase(patchVote.rejected, (state: any, action: any) => {
      //
    });
    // delete vote
    builder.addCase(deleteVote.fulfilled, (state: any, action: any) => {
      const changedIssueIndex = state.issues.findIndex(
        (issue: Issue) => issue.id === +action.payload.issueId
      );
      const voteType =
        state.issues[changedIssueIndex].vote.type === "Up"
          ? {
              upVoteCount: state.issues[changedIssueIndex].upVoteCount - 1,
            }
          : {
              downVoteCount: state.issues[changedIssueIndex].downVoteCount - 1,
            };
      const changedIssue = {
        ...state.issues[changedIssueIndex],
        ...voteType,
        ...{ vote: {} },
      };

      const newIssues = [
        ...state.issues.slice(0, changedIssueIndex),
        changedIssue,
        ...state.issues.slice(changedIssueIndex + 1),
      ];
      state.issues = newIssues;
    });
    builder.addCase(deleteVote.pending, (state: any, action: any) => {
      //
    });
    builder.addCase(deleteVote.rejected, (state: any, action: any) => {
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
      state.comments = [...state.comments, ...action.payload];
      state.isLoading = false;
      state.errorMsg = null;
    });
    builder.addCase(getComments.pending, (state: any, action: any) => {
      state.isLoading = true;
    });
    builder.addCase(getComments.rejected, (state: any, action: any) => {
      state.isLoading = false;
      state.errorMsg = action.payload;
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

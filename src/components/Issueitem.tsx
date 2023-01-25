import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { deleteVote } from "../store/action_creators/deleteVote";
import { patchIssue } from "../store/action_creators/patchIssue";
import { patchVote } from "../store/action_creators/patchVote";
import { postVote } from "../store/action_creators/postVote";
import { AppDispatch } from "../store/store";
import { toPersian } from "../utlils";

interface IssueitempropTypes {
  issue: any;
  allLabels: Label[];
}
function Issueitem({ issue, allLabels }: IssueitempropTypes) {
  const statusRef = useRef<HTMLSelectElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentUser, isAdmin } = useSelector(
    (state: any) => state.authenticationSlice
  );

  function voter(from: string, to: string) {
    // from: current vote(undefined if not exists), to: selected vote
    if (currentUser) {
      if (from === to) {
        // delete vote
        dispatch(deleteVote({ issueId: String(issue.id) }));
      } else if (from) {
        // patch vote
        dispatch(patchVote({ issueId: String(issue.id), type: to }));
      } else {
        // post vote
        dispatch(postVote({ type: to, issueId: String(issue.id) }));
      }
    } else {
      // not authenticated
      navigate("/login");
    }
  }
  function statusChangeHandler(event: React.ChangeEvent) {
    dispatch(
      patchIssue({
        issueId: String(issue.id),
        description: "",
        title: "",
        type: "",
        status: (event.target as HTMLSelectElement).value,
      })
    );
  }

  return (
    <div className="issue_item">
      <div className="flex_wrapper">
        <div className="comments_count">
          <img src="./comments-icon.png" alt="" className="comments-icon" />
          <div>{toPersian(issue.commentsCount || 0)}</div>
        </div>
        <Link to={`/issues/${issue.id}`} className="issue_body">
          <div className="title">{issue.title}</div>
          <div className="description">{issue.description} </div>
          <div className="tags">
            {allLabels.length !== 0 &&
              issue.labels &&
              issue.labels.length !== 0 &&
              issue.labels.map((label: string) => {
                const labelData = allLabels.find(
                  (labelObj) => labelObj.id === +label
                )!;
                return (
                  <div
                    key={labelData.id}
                    className="tag"
                    style={{ backgroundColor: `#${labelData?.color}` }}
                  >
                    {labelData.name}
                  </div>
                );
              })}
          </div>
        </Link>
        <div className="issue_voting">
          <img
            src="./upvote-icon.svg"
            alt=""
            className={`upvote ${issue.vote?.type === "Up" ? "selected" : ""}`}
            onClick={() => voter(issue.vote?.type, "Up")}
          />
          <div className="votes_count--green">
            {toPersian(issue.upVoteCount)}
          </div>
          <div className="votes_count--red">
            {issue.downVoteCount === 0
              ? toPersian(issue.downVoteCount)
              : toPersian(issue.downVoteCount) + "-"}
          </div>
          <img
            src="./downvote-icon.svg"
            alt=""
            className={`downvote ${
              issue.vote?.type === "Down" ? "selected" : ""
            }`}
            onClick={() => voter(issue.vote?.type, "Down")}
          />
        </div>
      </div>
      {isAdmin && (
        <select
          className="status_input"
          ref={statusRef}
          defaultValue={issue.status}
          onChange={statusChangeHandler}
        >
          <option value="Pending">در حال برنامه ریزی</option>
          <option value="InProgress">در حال انجام</option>
          <option value="Done">تمام شده</option>
        </select>
      )}
    </div>
  );
}

export default Issueitem;

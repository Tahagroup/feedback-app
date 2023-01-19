import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { postVote } from "../store/action_creators/postVote";
import { AppDispatch } from "../store/store";
import { toPersian } from "../utlils";

interface IssueitempropTypes {
  issue: Issue;
  allLabels: Label[];
}
function Issueitem({ issue, allLabels }: IssueitempropTypes) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoggedin = useSelector(
    (state: any) => state.authenticationSlice.currentUser
  );
  // const { votes } = useSelector((state: any) => state.issueSlice.currentUser);

  function voter(type: string) {
    if (isLoggedin) {
      dispatch(postVote({ type, issueId: `${issue.id}` }));
    } else {
      navigate("/login");
    }
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
            className="upvote"
            onClick={() => voter("Up")}
          />
          <div className="votes_count">
            {toPersian(issue.upVoteCount - issue.downVoteCount)}
          </div>
          <img
            src="./downvote-icon.svg"
            alt=""
            className="downvote"
            onClick={() => voter("Down")}
          />
        </div>
      </div>
    </div>
  );
}

export default Issueitem;

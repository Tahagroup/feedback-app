import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { patchIssue } from "../store/action_creators/patchIssue";
import { postVote } from "../store/action_creators/postVote";
import { AppDispatch } from "../store/store";
import { toPersian } from "../utlils";

interface IssueitempropTypes {
  issue: Issue;
  allLabels: Label[];
}
function Issueitem({ issue, allLabels }: IssueitempropTypes) {
  const statusRef = useRef<HTMLSelectElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [changed, setchanged] = useState(1);
  const { currentUser, isAdmin } = useSelector(
    (state: any) => state.authenticationSlice
  );
  // const useless = changed;
  // const issues = useSelector((state: any) => state.issueSlice);
  // console.log(issues);

  // const dasd = issues.filter((Allissue: Issue) => {
  //   console.log(Allissue.id, issue.id);

  //   return Allissue.id === issue.id;
  // });
  function voter(type: string) {
    if (currentUser) {
      dispatch(postVote({ type, issueId: `${issue.id}` }));
      setchanged((prev: number) => prev + 1);
    } else {
      navigate("/login");
    }
  }
  function statusChangeHandler(event: React.ChangeEvent) {
    dispatch(
      patchIssue({
        issueId: String(issue.id),
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

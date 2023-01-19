import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getFiles } from "../store/action_creators/getFiles";
import { postVote } from "../store/action_creators/postVote";
import { AppDispatch } from "../store/store";

interface IssueDetailsCardPropTypes {
  issue: SingleIssueResponse;
}
function IssueDetailsCard({ issue }: IssueDetailsCardPropTypes) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const isLoggedin = useSelector(
    (state: any) => state.authenticationSlice.currentUser
  );
  const { files } = useSelector((state: any) => state.issuesSlice);
  function voter(type: string) {
    if (isLoggedin) {
      dispatch(postVote({ type, issueId: `${issue.id}` }));
    } else {
      navigate("/login");
    }
  }
  const persianDate = new Date(issue.date).toLocaleDateString("fa-ir");
  useEffect(() => {
    dispatch(getFiles({ issueId: `${issue.id}` }));
  }, [dispatch, issue.id]);

  return (
    <div className="detail_item">
      <div className="text_details">
        <div className="detail_voting">
          <img
            src="../upvote-icon.svg"
            alt=""
            className="upvote"
            onClick={() => voter("Up")}
          />
          <div className="detail_type">
            {issue.type === "Bug" ? "باگ" : "پیشنهاد"}
          </div>
          <img
            src="../downvote-icon.svg"
            alt=""
            className="downvote"
            onClick={() => voter("Down")}
          />
        </div>
        <div className="detail_body">
          <div className="title">{issue.title}</div>
          <div className="description">{issue.description} </div>
        </div>
        <div className="issue_date">{persianDate}</div>
      </div>
      {files.length !== 0 && <div className="attachments">پیوست ها</div>}
      <div className="multimedia_details">
        {files.map((file: any) => (
          <div className="file_item" key={file.id}>
            {file.mimeType.split("/")[0] === "image" ? (
              <img className="file_thumb" src={file.path} alt="not found" />
            ) : (
              <video
                className="file_video"
                src={file.path}
                // poster="../file-icon.png"
                controls
              />
            )}
            <div className="file_name"> {file.name}</div>
            <a
              href={file.path}
              download
              target="_blank"
              rel="noreferrer"
              className="download_button"
            >
              بارگیری
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IssueDetailsCard;

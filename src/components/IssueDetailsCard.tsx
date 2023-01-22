import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getFiles } from "../store/action_creators/getFiles";
import { patchIssue } from "../store/action_creators/patchIssue";
import { postVote } from "../store/action_creators/postVote";
import { AppDispatch } from "../store/store";

interface IssueDetailsCardPropTypes {
  issue: SingleIssueResponse;
}
function IssueDetailsCard({ issue }: IssueDetailsCardPropTypes) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setisEditing] = useState(false);

  const { files } = useSelector((state: any) => state.issuesSlice);
  const { isAdmin, currentUser } = useSelector(
    (state: any) => state.authenticationSlice
  );

  function voter(type: string) {
    if (currentUser) {
      dispatch(postVote({ type, issueId: `${issue.id}` }));
    } else {
      navigate("/login");
    }
  }
  const persianDate = new Date(issue.date).toLocaleDateString("fa-ir");
  useEffect(() => {
    dispatch(getFiles({ issueId: `${issue.id}` }));
  }, [dispatch, issue.id]);

  function editHandler() {
    if (isEditing) {
      const newTitle = (titleRef.current as HTMLInputElement).value;
      const newDesc = (descRef.current as HTMLTextAreaElement).value;
      dispatch(
        patchIssue({
          issueId: String(issue.id),
          description: newDesc,
          title: newTitle,
          status: "",
          type: "",
        })
      );
      setisEditing(false);
      // navigate(`/issues/${issue.id}`);
    } else {
      setisEditing(true);
    }
  }

  return (
    <div className="detail_item">
      {isAdmin && (
        <div
          className={`button ${isEditing ? "editing_button" : "save_changes"}`}
          onClick={editHandler}
        >
          {isEditing ? "ذخیره تغییرات" : "ویرایش بازخورد"}
        </div>
      )}
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
          {isEditing ? (
            <div className="editing_wrapper">
              <input
                type="text"
                defaultValue={issue.title}
                className="title_editing"
                ref={titleRef}
              />
              <textarea
                defaultValue={issue.description}
                className="description_editing"
                ref={descRef}
              ></textarea>
            </div>
          ) : (
            <>
              <div className="title">{issue.title}</div>
              <div className="description">{issue.description} </div>
            </>
          )}
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

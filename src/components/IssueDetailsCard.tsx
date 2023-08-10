import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
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
  const location = useLocation();
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setisEditing] = useState(
    location.pathname.split("/").slice(-1)[0] === "edit" ? true : false
  );
  const [selectedToPreview, setSelectedToPreview] = useState<any>(null);
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
    dispatch(getFiles({ issueId: String(issue.id) }));
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
      window.location.reload();
    } else {
      setisEditing(true);
    }
  }

  function openPreviewWindowHandler(event: React.MouseEvent, fileInfo: any) {
    console.log(fileInfo);
    setSelectedToPreview(fileInfo);
  }

  function closePreviewhandler() {
    setSelectedToPreview(null);
  }

  function previewDownloadHandler(url: string, name: string) {
    const a = document.createElement("a");
    a.href = url;
    // console.log(`/${url.split("/").slice(-2).join("/")}/`);
    a.download = name;
    // a.setAttribute("download", true);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            <img
              className="file_thumb"
              src={
                file.mimeType.split("/")[0] === "image"
                  ? file.path
                  : "../video.png"
              }
              alt="Not Found"
              onClick={(event) =>
                openPreviewWindowHandler(event, {
                  fileName: file.name,
                  fileURL: file.path,
                  fileType: file.mimeType.split("/")[0],
                })
              }
              // data-name={file.name}
              // data-url={file.path}
              // data-type={file.path}
            />
            <div className="file_name"> {file.name}</div>
          </div>
        ))}
      </div>
      {selectedToPreview && (
        <div className="preview_page" onClick={closePreviewhandler}>
          <div className="prev_details_wrapper">
            <div
              className="prev_download_button"
              onClick={() =>
                previewDownloadHandler(
                  selectedToPreview.fileURL,
                  selectedToPreview.fileName
                )
              }
            >
              بارگیری
            </div>
            <div className="prev_file_name">{selectedToPreview.fileName}</div>
            {/* <a href={selectedToPreview.fileURL} download>
              Download
            </a> */}
          </div>
          {selectedToPreview.fileType === "image" ? (
            <img
              className="selected_image"
              src={selectedToPreview.fileURL}
              alt=""
            />
          ) : (
            <video
              className="selected_video"
              src={selectedToPreview.fileURL}
              controls
              autoPlay
            ></video>
          )}
        </div>
      )}
    </div>
  );
}

export default IssueDetailsCard;

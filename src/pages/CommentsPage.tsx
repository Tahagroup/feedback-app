import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import CommentItem from "../components/CommentItem";
import IssueDetailsCard from "../components/IssueDetailsCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { getComments } from "../store/action_creators/getComments";
import { getSingleIssue } from "../store/action_creators/getSingleIssue";
import { postComments } from "../store/action_creators/postComments";
import { issueActions } from "../store/slices/IssuesSlice";
import { AppDispatch } from "../store/store";
import { toPersian } from "../utlils";

function CommentsPage() {
  const { issueId } = useParams();
  const [inputLength, setInputLength] = useState<number>(0);
  const textRef = useRef(null);
  const offsetRef = useRef(0);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, visitingIssue, comments } = useSelector(
    (state: any) => state.issuesSlice
  );
  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    // if reaches end of page
    if (scrollTop + clientHeight >= scrollHeight) {
      if (issueId) {
        offsetRef.current = offsetRef.current + 20;
        dispatch(getComments({ issueId, offset: offsetRef.current }));
      }
    }
  }, [dispatch, issueId]);

  useEffect(() => {
    if (issueId) {
      dispatch(issueActions.setStartOfData());
      dispatch(getComments({ issueId, offset: 0 })).then(() => {
        window.addEventListener("scroll", onScroll);
      });
      dispatch(getSingleIssue({ issueId }));
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, [dispatch, issueId, onScroll]);

  function inputChangehandler(event: React.ChangeEvent) {
    setInputLength((event.target as HTMLTextAreaElement).value.length);
  }
  function sendClickHandler() {
    if (issueId && inputLength !== 0) {
      let text = (textRef.current! as HTMLTextAreaElement).value;
      dispatch(postComments({ text, issueId }));
      (textRef.current! as HTMLTextAreaElement).value = "";
      setInputLength(0);
      dispatch(getComments({ issueId, offset: 0 }));
    }
  }

  return (
    <div className="comments_Page">
      <div className="actions_part">
        <div className="previous_page_link">
          <span className="return" onClick={() => navigate("/issues")}>
            بازگشت
          </span>
          <img src="../return-icon.svg" alt="return" />
        </div>
      </div>
      {visitingIssue && <IssueDetailsCard issue={visitingIssue} />}
      <div className="newcomment_part">
        <div className="title">نظر جدید</div>
        <textarea
          className="comment_textarea"
          placeholder="نظر خود را اینجا وارد کنید."
          maxLength={300}
          onChange={inputChangehandler}
          ref={textRef}
        ></textarea>
        <div className="comment_actions">
          <div className="remaining_letters">
            {toPersian(300 - inputLength)} حرف باقیمانده است.
          </div>
          <div onClick={sendClickHandler} className="send_comment">
            ثبت نظر
          </div>
        </div>
      </div>
      <div className="comments_part">
        {comments.length !== 0 && (
          <div className="comments_count">{toPersian(comments.length)} نظر</div>
        )}
        <div className="comments_wrapper">
          {isLoading ? (
            <LoadingSpinner />
          ) : comments.length === 0 ? (
            "هیچ نظری ثبت نشده است."
          ) : (
            <>
              {comments.map((comment: any) => (
                <CommentItem comment={comment} key={comment.id} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommentsPage;

import React, { useEffect } from "react";
import { useDrop } from "react-dnd/dist/hooks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { json } from "stream/consumers";
import BoardIssueItem from "../components/BoardIssueItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { getIssues } from "../store/action_creators/getIssues";
import { patchIssue } from "../store/action_creators/patchIssue";
import { AppDispatch } from "../store/store";

function BoardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { issues, isLoading } = useSelector((state: any) => state.issuesSlice);
  const { isAdmin } = useSelector((state: any) => state.authenticationSlice);
  useEffect(() => {
    dispatch(getIssues({ offset: 0 }));
  }, [dispatch]);

  /////////////////////////////////////////////////////////////////////
  // [0] - Collected Props: An object containing collected properties from the collect function. If no collectfunction is defined, an empty object is returned.
  // [1] - DropTarget Ref: A connector function for the drop target. This must be attached to the drop-target portion of the DOM.
  const [{ isOverPending }, pendingDropRef] = useDrop(() => ({
    // The type (or types) to accept - strings or symbols
    accept: "issue",
    // This method is called when we hover over an element while dragging:
    drop(item: any, monitor) {
      // item is the dragged element
      if (item.currentStatus !== "Pending" && isAdmin) {
        dispatch(patchIssue({ issueId: item.id, status: "InProgress" }));
      }
    },
    // Props to collect
    collect: (monitor) => ({
      isOverPending: monitor.isOver(),
    }),
  }));
  ///////////////////
  const [{ isOverInProgress }, inProgressDropRef] = useDrop(() => ({
    accept: "issue",
    drop(item: any, monitor) {
      if (item.currentStatus !== "InProgress" && isAdmin) {
        dispatch(patchIssue({ issueId: item.id, status: "InProgress" }));
      }
    },
    collect: (monitor) => ({
      isOverInProgress: monitor.isOver(),
    }),
  }));
  ///////////////////
  const [{ isOverDone }, doneDropRef] = useDrop(() => ({
    accept: "issue",
    drop(item: any, monitor) {
      if (item.currentStatus !== "Done" && isAdmin) {
        dispatch(patchIssue({ issueId: item.id, status: "Done" }));
      }
    },
    collect: (monitor) => ({
      isOverDone: monitor.isOver(),
    }),
  }));
  /////////////////////////////////////////////////////////////////////
  return (
    <div className="boards_page">
      <div className="boards_header">
        <div className="header_buttons">
          <div
            className="new_issue"
            onClick={() => {
              navigate("/issues/new");
            }}
          >
            ➕ بازخورد جدید
          </div>
          <div
            className="return_to_homepage"
            onClick={() => {
              navigate("/issues");
            }}
          >
            🏠 صفحه اصلی
          </div>
        </div>
        <img className="logo" src="./bale-colored-logo.png" alt="" />
        <div className="roadmap">نقشه راه</div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="boards_container">
          <div
            className="board_item"
            ref={pendingDropRef}
            style={{ backgroundColor: isOverPending ? "#CD478F50" : "unset" }}
          >
            <div className="title">در حال برنامه ریزی</div>
            {issues
              .filter((issue: Issue) => issue.status === "Pending")
              .map((issue: Issue) => (
                <BoardIssueItem
                  issue={issue}
                  title={"در حال برنامه ریزی"}
                  key={issue.id}
                  borderColor={"#CD478F"}
                />
              ))}
          </div>
          <div
            className="board_item"
            ref={inProgressDropRef}
            style={{
              backgroundColor: isOverInProgress ? "#9247CD50" : "unset",
            }}
          >
            <div className="title">در حال انجام</div>
            {issues
              .filter((issue: Issue) => issue.status === "InProgress")
              .map((issue: Issue) => (
                <BoardIssueItem
                  issue={issue}
                  title={"در حال انجام"}
                  borderColor={"#9247CD"}
                  key={issue.id}
                />
              ))}
          </div>
          <div
            className="board_item"
            ref={doneDropRef}
            style={{ backgroundColor: isOverDone ? "#474CCD50" : "unset" }}
          >
            <div className="title">تمام شده</div>
            {issues
              .filter((issue: Issue) => issue.status === "Done")
              .map((issue: Issue) => (
                <BoardIssueItem
                  issue={issue}
                  title={"تمام شده"}
                  borderColor={"#474CCD"}
                  key={issue.id}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardPage;

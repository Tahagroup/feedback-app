import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import BoardIssueItem from "../components/BoardIssueItem";
import LoadingSpinner from "../components/LoadingSpinner";
import { getIssues } from "../store/action_creators/getIssues";
import { AppDispatch } from "../store/store";

function BoardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { issues, isLoading } = useSelector((state: any) => state.issuesSlice);
  useEffect(() => {
    dispatch(getIssues());
  }, [dispatch]);

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

      {/* /////////////////////// */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="boards_container">
          <div className="cateogry">
            <div className="title">در حال برنامه ریزی</div>
            {issues
              .filter((issue: Issue) => issue.status === "Pending")
              .map((issue: any) => (
                <BoardIssueItem
                  issue={issue}
                  title={"در حال برنامه ریزی"}
                  key={issue.key}
                  borderColor={"#CD478F"}
                />
              ))}
          </div>
          <div className="cateogry">
            <div className="title">در حال انجام</div>
            {issues
              .filter((issue: Issue) => issue.status === "InProgress")
              .map((issue: any) => (
                <BoardIssueItem
                  issue={issue}
                  title={"در حال انجام"}
                  borderColor={"#9247CD"}
                  key={issue.key}
                />
              ))}
          </div>
          <div className="cateogry">
            <div className="title">تمام شده</div>
            {issues
              .filter((issue: Issue) => issue.status === "Done")
              .map((issue: any) => (
                <BoardIssueItem
                  issue={issue}
                  title={"تمام شده"}
                  borderColor={"#474CCD"}
                  key={issue.key}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardPage;

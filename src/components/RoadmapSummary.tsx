import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toPersian } from "../utlils";
import LoadingSpinner from "./LoadingSpinner";

function RoadmapSummary() {
  const { isLoading, issues } = useSelector((state: any) => state.issuesSlice);
  const statusCounts =
    issues.length === 0
      ? { Pending: 0, InProgress: 0, Done: 0 }
      : issues.reduce(
          (
            acc: {
              Pending: number;
              InProgress: number;
              Done: number;
            },
            issue: Issue
          ) => {
            let newAccu;
            switch (issue.status) {
              case "Pending":
                newAccu = {
                  ...acc,
                  Pending: acc.Pending + 1,
                };
                break;
              case "InProgress":
                newAccu = {
                  ...acc,
                  InProgress: acc.InProgress + 1,
                };
                break;
              case "Done":
                newAccu = {
                  ...acc,
                  Done: acc.Done + 1,
                };
                break;
            }
            return newAccu;
          },
          { Pending: 0, InProgress: 0, Done: 0 }
        );

  return (
    <div className="roadmap_summary">
      <div className="roadmap_link">
        <div className="title">نقشه راه</div>
        <Link to={"/board"} className="more">
          مشاهده
        </Link>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="roadmap_counts">
          <div className="roadmap_item">
            <div>{toPersian(statusCounts.Pending)}</div>
            <div>در حال برنامه ریزی</div>
          </div>
          <div className="roadmap_item">
            <div>{toPersian(statusCounts.InProgress)}</div>
            <div>در حال انجام</div>
          </div>
          <div className="roadmap_item">
            <div>{toPersian(statusCounts.Done)}</div>
            <div>انجام شد</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoadmapSummary;

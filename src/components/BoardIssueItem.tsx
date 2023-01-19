import React from "react";
import { toPersian } from "../utlils";
interface BoardIssueItemProptypes {
  title: string;
  issue: Issue;
  borderColor: string;
}
function BoardIssueItem({
  issue,
  title,
  borderColor,
}: BoardIssueItemProptypes) {
  return (
    <div
      className="board_item"
      style={{ borderColor: borderColor }}
      key={issue.id}
    >
      <div className="header">
        <div className="status">{title}</div>
        <div className="comments_count">
          <div>{toPersian(issue.commentsCount || 0)}</div>
          <img src="./comments-icon.png" alt="" className="comments-icon" />
        </div>
      </div>
      <div className="body">
        <div className="issue_title">{issue.title}</div>
        <div className="issue_desc">{issue.description}</div>
      </div>
      <div className="footer">
        <div className="labels"></div>
        <div className="voting"></div>
      </div>
    </div>
  );
}

export default BoardIssueItem;

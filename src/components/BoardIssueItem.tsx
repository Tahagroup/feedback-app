import React from "react";
import { useDrag } from "react-dnd";
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
  const [{ isDragging }, dragRef] = useDrag(
    {
      // item is a plain JavaScript object describing the data being dragged
      item: { id: issue.id, currentStatus: issue.status, type: "issue" },
      //"type" is required. It is used by the "accept" specification of drop targets.
      // type is a string (or a symbol) uniquely identifying a whole class of items in your application
      type: "issue",
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        // isDragging: monitor.isDragging(),
      }),
    },
    []
  );
  return (
    <div
      className="boardIssue_item"
      style={{ borderColor: borderColor, opacity: isDragging ? "0.5" : "1" }}
      key={issue.id}
      ref={dragRef}
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

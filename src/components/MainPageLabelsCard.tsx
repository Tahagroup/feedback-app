import React from "react";

interface MainPageLabelsBoxPropTypes {
  filterChangeHandler: (event: React.MouseEvent<HTMLSpanElement>) => void;
  labels: any;
}
function MainPageLabelsBox({
  filterChangeHandler,
  labels,
}: MainPageLabelsBoxPropTypes) {
  return (
    <div className="labels_row">
      <span
        className="label_item active"
        onClick={filterChangeHandler}
        data-id={"all"}
      >
        همه
      </span>
      {labels.length !== 0 &&
        labels.map((label: Label) => (
          <span
            key={label.id}
            className="label_item"
            onClick={filterChangeHandler}
            style={{ backgroundColor: `#${label.color}` }}
            data-id={label.id}
          >
            {label.name}
          </span>
        ))}
    </div>
  );
}

export default MainPageLabelsBox;

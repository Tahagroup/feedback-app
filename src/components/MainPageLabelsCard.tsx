import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLabel } from "../store/action_creators/postLabels";
import { AppDispatch } from "../store/store";

interface MainPageLabelsBoxPropTypes {
  filterChangeHandler: (event: React.MouseEvent<HTMLSpanElement>) => void;
  labels: any;
}
function MainPageLabelsBox({
  filterChangeHandler,
  labels,
}: MainPageLabelsBoxPropTypes) {
  const [showPopup, setShowPopup] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const colorRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { isAdmin } = useSelector((state: any) => state.authenticationSlice);

  function addNewLabelHandler(event: React.FormEvent) {
    event.preventDefault();
    const name = (nameRef.current as HTMLInputElement).value;
    const color = (colorRef.current as HTMLInputElement).value.slice(1);

    if (name.trim() === "" || color.trim() === "" || !isAdmin) {
      return;
    }
    dispatch(postLabel({ name, color: parseInt(color, 16) })).then(() => {
      window.location.reload();
    });
  }

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
            style={{ backgroundColor: `#${label.color.toString(16)}` }}
            data-id={label.id}
          >
            {label.name}
          </span>
        ))}
      {isAdmin && (
        <div className="new_label_wrapper">
          <span
            className="label_item label_add_new"
            onClick={() => setShowPopup((prev) => !prev)}
            data-id={"new"}
          >
            برچسب جدید +
          </span>
          {showPopup && (
            <form className="pop_up_container" onSubmit={addNewLabelHandler}>
              <span className="close_popup" onClick={() => setShowPopup(false)}>
                ❌
              </span>
              <label htmlFor="">نام برچسب</label>
              <input className="name_input" type="text" ref={nameRef} />
              <label htmlFor="">رنگ(کلیک کنید)</label>
              <input
                className="color_input"
                type="color"
                ref={colorRef}
                defaultValue="#aaaaaa"
              />
              <button className="add_label_button" type="submit">
                ذخیره برچسب
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default MainPageLabelsBox;

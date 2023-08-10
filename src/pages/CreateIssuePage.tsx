import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getLabels } from "../store/action_creators/getLabels";
import { postIssues } from "../store/action_creators/postIssues";
import { AppDispatch, RootState } from "../store/store";

interface uploadedFiles {
  id: string;
  file: File;
}
function CreateIssuePage() {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const descTextRef = useRef<HTMLTextAreaElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const labelsRef = useRef<any[]>([]);
  const [uploadedFile, setuploadedFile] = useState<uploadedFiles[]>([]);

  const [dragActive, setDragActive] = React.useState(false);
  const [progress, setProgress] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  const labels = useSelector((state: RootState) => state.issuesSlice.labels);
  useEffect(() => {
    dispatch(getLabels());
  }, [dispatch]);

  function handleDrag(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  }
  function handleDropEvent(event: React.DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      for (const file of Array.from(event.dataTransfer.files)) {
        fileUploader(file);
      }
    }
  }

  function fileSelectHandler() {
    let input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = (_) => {
      for (const file of Array.from(input.files!)) {
        fileUploader(file);
      }
    };
    input.click();
  }

  function checkboxChangeHandler(event: React.ChangeEvent) {
    const isChecked = (event.target! as HTMLInputElement).checked;
    const checkboxValueId = (event.target! as HTMLInputElement).value;
    if (isChecked) {
      labelsRef.current.push(checkboxValueId);
    } else {
      labelsRef.current = labelsRef.current.filter(
        (label) => label !== checkboxValueId
      );
    }
  }
  async function fileUploader(file: File) {
    if (file === null) return;
    let xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (event) {
      const progress = ((event.loaded / event.total) * 100).toFixed(2);
      console.log("Upload Progress: ", progress);
      setProgress(+progress);
    };
    xhr.onload = () => {
      setuploadedFile((prev: any) => {
        const newState = prev.concat({ id: xhr.response.id, file });
        return newState;
      });
    };

    xhr.upload.onerror = function () {
      console.log("error " + this.status);
    };
    xhr.open("POST", "/files/upload");
    const formData = new FormData();
    formData.append("file", file);
    xhr.responseType = "json";
    xhr.send(formData);
  }

  function saveIssueHandler() {
    const title = titleRef.current!.value;
    const type = typeRef.current!.value as "Bug" | "Suggestion";
    const description = descTextRef.current!.value;
    if (title.trim() === "" || description.trim() === "") {
      return;
    }
    const fileIds = uploadedFile.map(
      (uploadedFile: uploadedFiles) => uploadedFile.id
    );
    console.log({
      title,
      description,
      type,
      labelIds: labelsRef.current,
      fileIds,
    });
    dispatch(
      postIssues({
        title,
        description,
        type,
        labelIds: labelsRef.current,
        fileIds,
      })
    );
    navigate("/");
  }

  return (
    <div className="create_issue_page">
      <div className="previous_page_link">
        <img src="../return-icon.svg" alt="return" />
        <span className="return" onClick={() => navigate("/")}>
          بازگشت
        </span>
      </div>
      <div className="create_issue_card">
        <div className="header">ایجاد بازخورد جدید</div>
        <div className="title_section">
          <div className="title">*عنوان بازخورد</div>
          <div className="help">راهنمایی در مورد عنوان بازخورد</div>
          <input
            dir="auto"
            type="text"
            className="title_input"
            ref={titleRef}
          />
        </div>
        <div className="type_section">
          <div className="title">موضوع</div>
          <div className="help">راهنمایی در مورد عنوان بازخورد</div>
          <select className="type_input" ref={typeRef}>
            <option value="Bug">باگ</option>
            <option value="Suggestion">پیشنهاد</option>
          </select>
        </div>
        <div className="labels_section">
          <div className="title">برچسب ها</div>
          <div className="help">راهنمایی در برچسب ها</div>
          {labels.map((label: Label) => (
            <div className="checkbox_wrapper" key={label.id}>
              <input
                type="checkbox"
                id={`${label.id}`}
                name="label"
                value={label.id}
                onChange={checkboxChangeHandler}
              ></input>
              <label
                className="checkbox_labels"
                htmlFor={`${label.id}`}
                style={{
                  backgroundColor: `#${label.color.toString(16)}`,
                }}
              >
                {label.name}
              </label>
            </div>
          ))}
        </div>
        <div className="desc_section">
          <div className="title">توضیحات</div>
          <div className="help">راهنمایی در مورد توضیحات بازخورد</div>
          <textarea
            name="description"
            className="desc_textarea"
            dir="auto"
            ref={descTextRef}
          ></textarea>
        </div>
        <div className="attach_section">
          <div className="title">مستندات</div>
          <div className="help">راهنمایی در مورد ارسال مستندات</div>
          <div className="dropped_files">
            {uploadedFile.length !== 0 &&
              uploadedFile.map((uploadedFile: any, index: number) => (
                <div className="uploaded_item" key={index}>
                  <img src="../file-icon.png" alt="file" />
                  <div className="uploaded_file">{uploadedFile.file.name}</div>
                  <div className="uploaded_percentage">{progress}%</div>
                </div>
              ))}
          </div>
          <div className="drop_zone">
            <form
              className="form-file-upload"
              onSubmit={(e) => e.preventDefault()}
            >
              <label
                className={`label-file-upload ${
                  dragActive ? "drag-active" : ""
                }`}
                htmlFor="input-file-upload"
              >
                <div
                  className="drag-file-element"
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDropEvent}
                >
                  {dragActive ? (
                    "!حالا رها کن"
                  ) : (
                    <div className="drop_button">
                      <span>فایل رو اینجا رها کن یا</span>
                      <button
                        className="file_input"
                        onClick={fileSelectHandler}
                      >
                        کلیک کن
                      </button>
                    </div>
                  )}
                </div>
              </label>
            </form>
          </div>
        </div>
        <div className="buttons_wrapper">
          <button className="draft" disabled>
            ذخیره به عنوان پیش نویس
          </button>
          <button className="save_feedback" onClick={saveIssueHandler}>
            ثبت بازخورد
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateIssuePage;

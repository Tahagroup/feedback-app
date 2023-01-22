import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { authActions } from "../store/slices/AuthSlice";
import { toPersian } from "../utlils";

interface MainPageHeaderPropTypes {
  issuesCount: number;
  selectedSortRef: any;
  sortOptionChangeHandler: (value: string) => void;
}
function MainPageHeader({
  issuesCount,
  selectedSortRef,
  sortOptionChangeHandler,
}: MainPageHeaderPropTypes) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: any) => state.authenticationSlice.currentUser
  );
  return (
    <div className="sorting">
      <div
        className="logout"
        onClick={() =>
          currentUser ? dispatch(authActions.logoutUser()) : navigate("/login")
        }
      >
        {currentUser ? "خروج" : "ورود"}
      </div>

      {currentUser && (
        <div className="profile_page" onClick={() => navigate("/profile")}>
          صفحه کاربری
        </div>
      )}
      {/* /////////////////////////////////////// */}
      <div className="feedback_count">
        <span style={{ marginRight: "5px" }}> فیدبک </span>
        <span>{toPersian(issuesCount)}</span>
      </div>
      <div className="sorting_select">
        <select
          name="sort"
          className="sortBy"
          onChange={(event) => sortOptionChangeHandler(event.target.value)}
          defaultValue="Votes"
          ref={selectedSortRef}
        >
          <option value="Votes">بیشترین رای مثبت</option>
          <option value="Date">جدیدترین</option>
        </select>
        <span className="sorting_title"> :مرتب سازی</span>
      </div>
      <div
        className="new_issue"
        onClick={() => {
          navigate("/issues/new");
        }}
      >
        جدید +
      </div>
    </div>
  );
}

export default MainPageHeader;

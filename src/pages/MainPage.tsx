import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Issueitem from "../components/Issueitem";
import LoadingSpinner from "../components/LoadingSpinner";
import MainPageHeader from "../components/MainPageHeader";
import MainPageLabelsBox from "../components/MainPageLabelsCard";
import RoadmapSummary from "../components/RoadmapSummary";
import { getIssues } from "../store/action_creators/getIssues";
import { getIssuesAndReplace } from "../store/action_creators/getIssuesAndReplace";
import { getLabels } from "../store/action_creators/getLabels";
import { AppDispatch } from "../store/store";

////////////////////////////////////////////////////////////////////////
function MainPage() {
  const selectedSortRef = useRef(null);
  const [sortOption, setsortOption] = useState("Votes");
  const [filterOption, setFilterOption] = useState<string | number>("all");
  const offsetRef = useRef<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { issues, labels, isLoading, errorMsg } = useSelector(
    (state: any) => state.issuesSlice
  );

  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight) {
      if (errorMsg !== "End of Issues") {
        offsetRef.current = offsetRef.current + 20;
        dispatch(getIssues({ offset: offsetRef.current, sortBy: sortOption }));
      }
    }
  }, [dispatch, errorMsg, sortOption]);
  useEffect(() => {
    dispatch(
      getIssuesAndReplace({ offset: offsetRef.current, sortBy: sortOption })
    );
    dispatch(getLabels());
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [dispatch, sortOption, onScroll]);

  const filteredIssues = issues.filter((issue: Issue) => {
    if (filterOption === "all") {
      return issue;
    }
    return (issue.labels as unknown as number[]).includes(+filterOption);
  });

  function filterChangeHandler(event: React.MouseEvent<HTMLSpanElement>) {
    const selectedFilterElement = event.target as HTMLSpanElement;
    document
      .querySelectorAll(".label_item")
      .forEach((filterElement) => filterElement.classList.remove("active"));
    selectedFilterElement.classList.add("active");
    setFilterOption(selectedFilterElement.getAttribute("data-id")!);
  }
  function sortOptionChangeHandler(value: string) {
    offsetRef.current = 0;
    setsortOption(value);
  }

  const issuesCount: number = issues.length;
  return (
    <div className="main_page_wrapper">
      <div className="issues_wrapper">
        <MainPageHeader
          issuesCount={issuesCount}
          selectedSortRef={selectedSortRef}
          sortOptionChangeHandler={sortOptionChangeHandler}
        />
        <div className="issue_items_wrapper">
          {/* {errorMsg && <div>{errorMsg}</div>} */}
          {isLoading && <LoadingSpinner />}
          {issues.length !== 0 &&
            filteredIssues.map((issue: Issue) => (
              <Issueitem issue={issue} allLabels={labels} key={issue.id} />
            ))}
        </div>
      </div>
      <div className="filter_roadmap">
        <div className="bale_logo">
          <div className="bale_gradient"></div>
          <div className="logo_flex">
            <img src="./bale-colored-logo.png" alt="" />
            <div className="bale_feedback">بازخورد بله</div>
          </div>
        </div>
        <MainPageLabelsBox
          filterChangeHandler={(event: React.MouseEvent<HTMLSpanElement>) =>
            filterChangeHandler(event)
          }
          labels={labels}
        />
        <RoadmapSummary />
      </div>
    </div>
  );
}

export default MainPage;

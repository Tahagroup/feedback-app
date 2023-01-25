import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getComments } from "./store/action_creators/getComments";
import { AppDispatch } from "./store/store";

function useFetch(offset: number, issueId: string) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getComments({ issueId, offset }));
  }, [offset, dispatch, issueId]);
}

export default useFetch;

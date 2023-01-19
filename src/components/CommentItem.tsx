import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserId } from "../store/action_creators/getUserId";
import { AppDispatch } from "../store/store";
import LoadingSpinner from "./LoadingSpinner";
interface CommentItemProptypes {
  comment: any;
}
function CommentItem({ comment }: CommentItemProptypes) {
  const dispatch = useDispatch<AppDispatch>();
  const userInfos = useSelector(
    (state: any) => state.authenticationSlice.userInfos
  );
  const [username, setusername] = useState();

  useEffect(() => {
    const foundInStore = userInfos.find((userinfo: getUserResponseType) => {
      return userinfo.id === comment.userId;
    });

    if (foundInStore) {
      setusername(foundInStore.name);
    } else {
      dispatch(getUserId({ userId: comment.userId }));
    }
  }, [dispatch, comment.userId, userInfos]);
  // console.log(userInfo);

  return (
    <>
      {userInfos.length !== 0 && (
        <div className="comment_item">
          <img className="profile_pic" src="../profile-pic.jpg" alt="" />
          <div className="comment_body">
            <div className="comment_user">{username}</div>
            <div className="comment_text">{comment.text}</div>
          </div>
          <div></div>
        </div>
      )}
    </>
  );
}

export default CommentItem;

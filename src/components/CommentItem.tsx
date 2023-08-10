interface CommentItemProptypes {
  comment: any;
}
function CommentItem({ comment }: CommentItemProptypes) {
  // const dispatch = useDispatch<AppDispatch>();
  const userInfos = [
    { id: 1, name: "aaa" },
    { id: 2, name: "admin" },
    { id: 3, name: "ccc" },
    { id: 4, name: "bbb" },
    // { id: 5, name: "ddd" },
    // { id: 6, name: "eee" },
    // { id: 7, name: "qqq" },
  ];

  // useEffect(() => {
  //   const foundInStore = userInfos.find((userinfo: getUserResponseType) => {
  //     return userinfo.id === comment.userId;
  //   });

  //   // if (foundInStore) {
  //   //   setusername(foundInStore.name);
  //   // } else {
  //   //   dispatch(getUserId({ userId: comment.userId }));
  //   // }
  // }, [dispatch, comment.userId, userInfos]);
  const username = userInfos.filter(
    (userInfo: any) => userInfo.id === comment.userId
  )[0].name;
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

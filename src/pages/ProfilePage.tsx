import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { getUserId } from "../store/action_creators/getUserId";
import { patchUserInfo } from "../store/action_creators/patchUserInfo";
import { authActions } from "../store/slices/AuthSlice";
import { AppDispatch } from "../store/store";
import { toPersian } from "../utlils";

function ProfilePage() {
  const { currentUser, isAdmin, foundUser, adminsList } = useSelector(
    (state: any) => state.authenticationSlice
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const nameRef = useRef(currentUser.name);
  const emailRef = useRef(currentUser.email);
  const userIdRef = useRef<HTMLInputElement>(null);
  function formSubmitHandler(event: React.FormEvent) {
    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    dispatch(
      patchUserInfo({
        userId: currentUser.id,
        name,
        email,
      })
    );
    navigate("/issues");
  }
  function userSearchFormHandler(event: React.FormEvent) {
    event.preventDefault();
    const enteredId = (userIdRef.current as HTMLInputElement).value;
    if (enteredId.trim() === "" || isNaN(+enteredId)) {
      return;
    }
    dispatch(getUserId({ userId: enteredId }));
  }

  let foundUserIsAdmin: boolean = false;
  if (foundUser) {
    foundUserIsAdmin = adminsList.includes(foundUser?.id);
  }
  function changeAccessHandler(userIsAdmin: boolean) {
    if (userIsAdmin) {
      dispatch(authActions.demoteUser(foundUser.id));
    } else {
      dispatch(authActions.promoteUser(foundUser.id));
    }
  }

  return (
    <div className="profilePage">
      <div className="loggedin_card">
        <div className="current_name">سلام {currentUser.name}!</div>
        <div className="howtoupdate">
          برای تغییر نام کاربری و ایمیل حسابت میتونی از فرم پایین استفاده کنی.
        </div>
      </div>
      <form className="updateCard" onSubmit={formSubmitHandler}>
        <div className="update_item">
          <div>نام کاربری جدید</div>
          <input
            type="text"
            className="name input"
            defaultValue={currentUser.name}
            ref={nameRef}
          />
        </div>
        <div className="update_item">
          <div>ایمیل جدید</div>
          <input
            type="text"
            className="email input"
            defaultValue={currentUser.email}
            ref={emailRef}
          />
        </div>
        <div className="form_actions">
          <button type="submit" className="update_user">
            بروزرسانی اطلاعات
          </button>
          <button
            type="submit"
            className="cancel_update"
            onClick={() => navigate("/issues")}
          >
            انصراف
          </button>
        </div>
      </form>
      {isAdmin && (
        <div className="access_control">
          <div className="explain">
            شناسه کاربر را وارد کرده و سپس دکمه <kbd>Enter</kbd> را فشار دهید.
          </div>
          <form onSubmit={userSearchFormHandler}>
            <input
              type="text"
              className="search_users"
              ref={userIdRef}
              placeholder="شناسه کاربر موردنظر را وارد کنید."
            />
          </form>
          {foundUser && (
            <div className="access_change">
              <div className="found_user">نام کاربر: {foundUser.name}</div>
              <div className="found_user">شناسه: {toPersian(foundUser.id)}</div>
              <div
                className="promote_demote"
                onClick={() => changeAccessHandler(foundUserIsAdmin)}
              >
                {foundUserIsAdmin ? "تنزیل به کاربر" : "ترفیع به مدیر"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default ProfilePage;

// {isAdmin && (
//   <div className="approving_card">
//     {/* render issues which are not approved, beside them buttons to approve */}
//     {issues.map((issue: Issue) => {
//       return (
//         <div className="approve_item" key={issue.id}>
//           <Issueitem issue={issue} allLabels={labels} />
//           <div className="approve_buttons">
//             <div className="approve" onClick={issueApproveHandler}>
//               تایید
//             </div>
//             <div className="deny">رد</div>
//           </div>
//         </div>
//       );
//     })}
//   </div>
// )}

import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { patchUserInfo } from "../store/action_creators/patchUserInfo";
import { AppDispatch } from "../store/store";

function ProfilePage() {
  const currentUser = useSelector(
    (state: any) => state.authenticationSlice.currentUser
  );
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const nameRef = useRef(currentUser.name);
  const emailRef = useRef(currentUser.email);

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
    </div>
  );
}

export default ProfilePage;

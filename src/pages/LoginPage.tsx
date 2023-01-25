import React, { FormEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { useNavigate } from "react-router";
import { postLoggedinUser } from "../store/action_creators/postLoggedinUser";
import { AppDispatch } from "../store/store";

function LoginPage() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, errorMsg } = useSelector(
    (state: any) => state.authenticationSlice
  );
  function formSubmitHandler(event: FormEvent) {
    event.preventDefault();
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    dispatch(postLoggedinUser({ email, password }));
  }
  return (
    <div className="auth_page">
      <div className="loginWrapper">
        <div className="auth_left">
          <div className="logo_wrapper">
            <img src="./bale-logo.png" alt="" />
          </div>
          <div className="blured"></div>
          <img src="./loginBG.jpg" alt="login" />
        </div>
        <div className="auth_right">
          <form onSubmit={formSubmitHandler}>
            <div className="input_wrapper">
              <label htmlFor="email">ایمیل</label>
              <input
                id="email"
                type="text"
                placeholder="Email"
                ref={emailRef}
                required
              />
            </div>
            <div className="input_wrapper">
              <label htmlFor="password">رمز عبور</label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
              />
            </div>
            <button type="submit">{isLoading ? "⏳" : "ورود"}</button>
            {errorMsg && <div className="auth_error">⚠ {errorMsg}</div>}
            <div
              onClick={() => navigate("/signup")}
              className="toggle-login-signup"
            >
              .حساب کاربری ندارید؟ ثبت نام کنید
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

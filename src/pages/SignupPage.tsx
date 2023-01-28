import React, { FormEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux/es/exports";
import { useNavigate } from "react-router";
import { postSignedupUser } from "../store/action_creators/postSignedupUser";
import { AppDispatch } from "../store/store";

function SignupPage() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isLoading, errorMsg } = useSelector(
    (state: any) => state.authenticationSlice
  );

  function formSubmitHandler(event: FormEvent) {
    event.preventDefault();
    const username = usernameRef.current!.value;
    const email = emailRef.current!.value;
    const password = passwordRef.current!.value;
    dispatch(postSignedupUser({ username, email, password }));
  }

  return (
    <div className="auth_page">
      <div className="loginWrapper">
        <img className="mobile_bg mobile-only" src="./loginBG.jpg" alt="bg" />
        <div className="auth_left desktop-only">
          <div className="logo_wrapper">
            <img src="./bale-logo.png" alt="" />
          </div>
          <div className="blured"></div>
          <img src="./loginBG.jpg" alt="login" />
        </div>
        <div className="auth_right">
          <img
            className="mobile-only"
            style={{ marginTop: "20px" }}
            src="./bale-logo.png"
            alt=""
          />
          <form onSubmit={formSubmitHandler}>
            <div className="input_wrapper">
              <label htmlFor="username">نام کاربری</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                ref={usernameRef}
                required
              />
            </div>
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
            <button type="submit">{isLoading ? "⏳" : "ثبت نام"}</button>
            {errorMsg && <div className="auth_error">⚠ {errorMsg}</div>}
            <div
              onClick={() => navigate("/login")}
              className="toggle-login-signup"
            >
              .حساب دارید؟ وارد شوید
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

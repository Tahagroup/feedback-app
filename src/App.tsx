import React from "react";
import "./scss/styles.ts";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "./store/store";
import CreateIssuePage from "./pages/CreateIssuePage";
import BoardPage from "./pages/BoardPage";
import CommentsPage from "./pages/CommentsPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  // fetch("http://localhost:3000/auth/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     email: "aaa",
  //     password: "aaa",
  //   }),
  // })
  //   .then((response) => response.text())
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log("error", error));

  const authedUser = useSelector(
    (state: RootState) => state.authenticationSlice.currentUser
  );
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/issues" />} />
        <Route
          path="/login"
          element={authedUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/signup"
          element={authedUser ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/issues" element={<MainPage />} />
        <Route
          path="/profile"
          element={authedUser ? <ProfilePage /> : <LoginPage />}
        />
        <Route
          path="/issues/new"
          element={authedUser ? <CreateIssuePage /> : <Navigate to="/login" />}
        />
        <Route path="/issues/:issueId" element={<CommentsPage />} />
        <Route
          path="/issues/:issueId/edit"
          // element={authedUser ? <CreateIssuePage /> : <Navigate to="/login" />}
          element={<CommentsPage />}
        />
      </Routes>
    </div>
  );
}

export default App;

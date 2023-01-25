import React, { useEffect, useState } from "react";
import "./scss/styles.ts";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { AppDispatch, RootState } from "./store/store";
import CreateIssuePage from "./pages/CreateIssuePage";
import BoardPage from "./pages/BoardPage";
import CommentsPage from "./pages/CommentsPage";
import ProfilePage from "./pages/ProfilePage";
import { useDispatch } from "react-redux";
import { getUserFromLocalStorage } from "./store/action_creators/getUserFromLocalStorage";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getUserFromLocalStorage()).then(() => {
      setReadFromLocalStorage(true);
    });
  }, [dispatch]);

  const [readFromLocalStorage, setReadFromLocalStorage] = useState(false);
  const { currentUser } = useSelector(
    (state: RootState) => state.authenticationSlice
  );

  return (
    <div className="App">
      {readFromLocalStorage && (
        <Routes>
          <Route path="/" element={<Navigate to="/issues" />} />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/issues" /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/issues" /> : <SignupPage />}
          />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/issues" element={<MainPage />} />
          <Route
            path="/profile"
            element={currentUser ? <ProfilePage /> : <LoginPage />}
          />
          <Route
            path="/issues/new"
            element={
              currentUser ? <CreateIssuePage /> : <Navigate to="/login" />
            }
          />
          <Route path="/issues/:issueId" element={<CommentsPage />} />
          <Route
            path="/issues/:issueId/edit"
            // element={authedUser ? <CreateIssuePage /> : <Navigate to="/login" />}
            element={<CommentsPage />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;

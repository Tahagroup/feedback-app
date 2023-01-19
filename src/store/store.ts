import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AuthSlice from "./slices/AuthSlice";
import IssuesSlice from "./slices/IssuesSlice";
// also import other slices if available
// create the store(initial setup of redux which will be passed to top level component to give every child component access to redux data)

const rootReducer = combineReducers({
  authenticationSlice: AuthSlice.reducer,
  issuesSlice: IssuesSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

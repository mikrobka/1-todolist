import { AnyAction, combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { appReducer } from "app/model/app.slice";
import { authReducer } from "features/auth/login/model/auth.slice";
import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer } from "features/todolists-list/tasks/model";
import { todolistsReducer } from "features/todolists-list/todolists/todolist/model";

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppRootStateType = ReturnType<typeof rootReducer>;

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>;

// @ts-ignore
window.store = store;

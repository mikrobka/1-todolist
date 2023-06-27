import { todolistsAPI, TodolistType } from "api/todolists-api";
import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerNetworkError } from "utils/error-utils";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const todoListSlice = createSlice({
  name: "todoList",
  initialState: {} as TodolistDomainType[],
  reducers: {
    removeTodoList: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.slice(index, 1);
      }
    },
    addTodoList: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    },
    changeTodoListTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index].title = action.payload.title;
      }
    },
    changeTodoListFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index].filter = action.payload.filter;
      }
    },
    changeTodoListEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state[index].entityStatus = action.payload.entityStatus;
      }
    },
    setTodoLists: (state, action: PayloadAction<{ todolist: TodolistType[] }>) => {
      return action.payload.todolist.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
    },
  },
});

// thunks
export const fetchTodolistsTC = (): AppThunk => {
  return (dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }));
    todolistsAPI
      .getTodolists()
      .then((res) => {
        dispatch(todolistActions.setTodoLists({ todolist: res.data }));
        dispatch(appActions.setStatus({ status: "succeeded" }));
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };
};
export const removeTodolistTC = (todolistId: string): AppThunk => {
  return (dispatch: Dispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(appActions.setStatus({ status: "loading" }));
    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(todolistActions.changeTodoListEntityStatus({ id: todolistId, entityStatus: "loading" }));
    todolistsAPI.deleteTodolist(todolistId).then((res) => {
      dispatch(todolistActions.removeTodoList({ id: todolistId }));
      //скажем глобально приложению, что асинхронная операция завершена
      dispatch(appActions.setStatus({ status: "succeeded" }));
    });
  };
};
export const addTodolistTC = (title: string): AppThunk => {
  return (dispatch: Dispatch) => {
    dispatch(appActions.setStatus({ status: "loading" }));
    todolistsAPI.createTodolist(title).then((res) => {
      dispatch(todolistActions.addTodoList({ todolist: res.data.data.item }));
      dispatch(appActions.setStatus({ status: "succeeded" }));
    });
  };
};
export const changeTodolistTitleTC = (todolistId: string, newTitle: string): AppThunk => {
  return (dispatch: Dispatch) => {
    todolistsAPI.updateTodolist(todolistId, newTitle).then((res) => {
      dispatch(todolistActions.changeTodoListTitle({ id: todolistId, title: newTitle }));
    });
  };
};

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todolistActions = todoListSlice.actions;
export const todolistReducer = todoListSlice.reducer;

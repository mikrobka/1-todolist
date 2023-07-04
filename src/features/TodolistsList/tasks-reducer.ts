import { todolistActions, todolistThunks } from "./todolists-reducer";

import { appActions } from "app/app-reducer";
import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";
import { TaskType, todolistsAPI, UpdateTaskArgType, UpdateTaskModelType } from "features/TodolistsList/todolists.api";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enum";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = state[action.payload.todolistId].map((t) =>
          t.id === action.payload.taskId ? { ...t, ...action.payload.domainModel } : t
        );
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId);
        if (index !== -1) {
          state[action.payload.todolistId].splice(index, 1);
        }
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId] = [action.payload.task, ...state[action.payload.task.todoListId]];
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(todolistActions.addTodoList, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistActions.removeTodoList, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolist.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  },
});

// thunks
const fetchTasks = createAppAsyncThunk<
  {
    tasks: TaskType[];
    todolistId: string;
  },
  string
>("tasks/fetchTasks", async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(
      appActions.setStatus({
        status: "loading",
      })
    );
    const res = await todolistsAPI.getTasks(todolistId);
    const tasks = res.data.items;
    dispatch(
      appActions.setStatus({
        status: "succeeded",
      })
    );
    return {
      tasks: tasks,
      todolistId: todolistId,
    };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export const removeTask = createAppAsyncThunk<
  {
    taskId: string;
    todolistId: string;
  },
  {
    taskId: string;
    todolistId: string;
  }
>(
  "tasks/removeTask",
  async (
    arg: {
      taskId: string;
      todolistId: string;
    },
    thunkAPI
  ) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    const { todolistId, taskId } = arg;
    try {
      const res = await todolistsAPI.deleteTask(todolistId, taskId);
      if (res.data.resultCode === ResultCode.success) {
        return { todolistId: todolistId, taskId: taskId };
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (e) {
      handleServerNetworkError(e, dispatch);
      return rejectWithValue(null);
    }
  }
);

const addTask = createAppAsyncThunk<
  {
    task: TaskType;
  },
  {
    todolistId: string;
    title: string;
  }
>("tasks/addTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const { todolistId, title } = arg;
  try {
    dispatch(appActions.setStatus({ status: "loading" }));
    const res = await todolistsAPI.createTask(todolistId, title);
    if (res.data.resultCode === ResultCode.success) {
      const task = res.data.data.item;
      dispatch(
        appActions.setStatus({
          status: "succeeded",
        })
      );
      return { task: task };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const updateTask = createAppAsyncThunk<any, UpdateTaskArgType>("tasks/updateTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue, getState } = thunkAPI;
  const { todolistId, taskId, ...domainModel } = arg;
  try {
    dispatch(appActions.setStatus({ status: "loading" }));
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
      dispatch(
        appActions.setStatus({
          status: "succeeded",
        })
      );
      console.warn("task not found in the state");
      return;
    }
    const apiModel: UpdateTaskModelType = {
      deadline: task.deadline,
      description: task.description,
      priority: task.priority,
      startDate: task.startDate,
      title: task.title,
      status: task.status,
      ...domainModel,
    };

    const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setStatus({ status: "succeeded" }));
      return arg;
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};

export const tasksThunks = {
  fetchTasks,
  removeTask,
  addTask,
  updateTask,
};
export const tasksReducer = taskSlice.reducer;
export const tasksActions = taskSlice.actions;

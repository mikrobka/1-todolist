import { todolistActions } from "./todolists-reducer";
import { TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType } from "api/todolists-api";
import { Dispatch } from "redux";
import { AppRootStateType } from "app/store";
import { handleServerAppError, handleServerNetworkError } from "utils/error-utils";
import { appActions } from "app/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {
    removeTask: (state, action: PayloadAction<{ todolistId: string; taskId: string }>) => {
      const index = state[action.payload.todolistId].findIndex((task) => task.id === action.payload.taskId);
      if (index !== -1) {
        state[action.payload.todolistId].splice(index, 1);
      }
    },
    addTask: (state, action: PayloadAction<{ task: TaskType }>) => {
      state[action.payload.task.todoListId] = [action.payload.task, ...state[action.payload.task.todoListId]];
    },
    updateTask: (
      state,
      action: PayloadAction<{
        todolistId: string;
        model: UpdateDomainTaskModelType;
        taskId: string;
      }>
    ) => {
      state[action.payload.todolistId] = state[action.payload.todolistId].map((t) =>
        t.id === action.payload.taskId ? { ...t, ...action.payload.model } : t
      );
    },
    setTasks: (state, action: PayloadAction<{ tasks: TaskType[]; todolistId: string }>) => {
      state[action.payload.todolistId] = action.payload.tasks;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(todolistActions.addTodoList, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistActions.removeTodoList, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistActions.setTodoLists, (state, action) => {
        action.payload.todolist.forEach((tl) => {
          state[tl.id] = [];
        });
      });
  },
});

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }));
  todolistsAPI.getTasks(todolistId).then((res) => {
    const tasks = res.data.items;
    dispatch(tasksActions.setTasks({ tasks: tasks, todolistId: todolistId }));
    dispatch(appActions.setStatus({ status: "succeeded" }));
  });
};
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
  todolistsAPI.deleteTask(todolistId, taskId).then((res) => {
    if (res.data.resultCode === 0) {
      const action = tasksActions.removeTask({ taskId: taskId, todolistId: todolistId });
      dispatch(action);
    }
  });
};
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
  dispatch(appActions.setStatus({ status: "loading" }));
  todolistsAPI
    .createTask(todolistId, title)
    .then((res) => {
      if (res.data.resultCode === 0) {
        const task = res.data.data.item;
        const action = tasksActions.addTask({ task: task });
        dispatch(action);
        dispatch(appActions.setStatus({ status: "succeeded" }));
      } else {
        handleServerAppError(res.data, dispatch);
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch);
    });
};
export const updateTaskTC =
  (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
  (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
    const state = getState();
    const task = state.tasks[todolistId].find((t) => t.id === taskId);
    if (!task) {
      //throw new Error("task not found in the state");
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

    todolistsAPI
      .updateTask(todolistId, taskId, apiModel)
      .then((res) => {
        if (res.data.resultCode === 0) {
          const action = tasksActions.updateTask({
            taskId: taskId,
            model: domainModel,
            todolistId: todolistId,
          });
          dispatch(action);
        } else {
          handleServerAppError(res.data, dispatch);
        }
      })
      .catch((error) => {
        handleServerNetworkError(error, dispatch);
      });
  };

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

type ThunkDispatch = Dispatch;

export const tasksReducer = taskSlice.reducer;
export const tasksActions = taskSlice.actions;

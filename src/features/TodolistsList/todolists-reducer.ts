import { appActions, RequestStatusType } from "app/app-reducer";
import { handleServerNetworkError } from "common/utils/handleServerNetworkError";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsAPI, TodolistType } from "features/TodolistsList/todolists.api";
import { createAppAsyncThunk } from "common/utils";

const todoListSlice = createSlice({
  name: "todoList",
  initialState: [] as TodolistDomainType[],
  reducers: {
    removeTodoList: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
    addTodoList: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
      state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolist.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.splice(index, 1);
        }
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state[index].title = action.payload.title;
        }
      });
  },
});

// thunks

const fetchTodolists = createAppAsyncThunk<{
  todolist: TodolistType[];
}>("todolists/fetchTodolists", async (arg, thunkApi) => {
  const { dispatch, rejectWithValue } = thunkApi;
  try {
    dispatch(appActions.setStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    debugger;
    dispatch(appActions.setStatus({ status: "succeeded" }));
    return { todolist: res.data };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const removeTodolist = createAppAsyncThunk<
  { id: string },
  {
    todolistId: string;
  }
>("todolists/removeTodolist", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const { todolistId } = arg;
  try {
    dispatch(appActions.setStatus({ status: "loading" }));
    dispatch(todolistActions.changeTodoListEntityStatus({ id: todolistId, entityStatus: "loading" }));
    await todolistsAPI.deleteTodolist(todolistId);
    dispatch(appActions.setStatus({ status: "succeeded" }));
    return { id: todolistId };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const addTodolist = createAppAsyncThunk<
  { todolist: TodolistType },
  {
    title: string;
  }
>("todolists/addTodolist", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const { title } = arg;
  try {
    dispatch(appActions.setStatus({ status: "loading" }));
    const res = await todolistsAPI.createTodolist(title);
    dispatch(appActions.setStatus({ status: "succeeded" }));
    return { todolist: res.data.data.item };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});
const changeTodolistTitle = createAppAsyncThunk<
  { id: string; title: string },
  {
    todolistId: string;
    newTitle: string;
  }
>("todolists/changeTodolistTitle", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  const { todolistId, newTitle } = arg;
  try {
    dispatch(appActions.setStatus({ status: "loading" }));
    await todolistsAPI.updateTodolist(todolistId, newTitle);
    dispatch(appActions.setStatus({ status: "succeeded" }));
    return { id: todolistId, title: newTitle };
  } catch (e) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todolistActions = todoListSlice.actions;
export const todolistReducer = todoListSlice.reducer;
export const todolistThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle };

import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppRootStateType } from "app/store";
import { FilterValuesType, todolistActions, TodolistDomainType, todolistThunks } from "./todolists-reducer";
import { TasksStateType, tasksThunks } from "./tasks-reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "common/hooks/useAppDispatch";
import { TaskStatuses } from "common/enum";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists);
  const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks);
  const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    dispatch(todolistThunks.fetchTodolists());
  }, []);

  const removeTask = useCallback((taskId: string, todolistId: string) => {
    dispatch(tasksThunks.removeTask({ taskId: taskId, todolistId: todolistId }));
  }, []);

  const addTask = useCallback(function (title: string, todolistId: string) {
    dispatch(tasksThunks.addTask({ title: title, todolistId: todolistId }));
  }, []);

  const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId: id, domainModel: { status: status }, todolistId: todolistId }));
  }, []);

  const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
    dispatch(tasksThunks.updateTask({ taskId: id, domainModel: { title: newTitle }, todolistId: todolistId }));
  }, []);

  const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
    const action = todolistActions.changeTodoListFilter({ id: todolistId, filter: value });
    dispatch(action);
  }, []);

  const removeTodolist = useCallback(function (id: string) {
    dispatch(todolistThunks.removeTodolist({ todolistId: id }));
  }, []);

  const changeTodolistTitle = useCallback(function (id: string, title: string) {
    dispatch(todolistThunks.changeTodolistTitle({ todolistId: id, newTitle: title }));
  }, []);

  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistThunks.addTodolist({ title: title }));
    },
    [dispatch]
  );

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTask}
                  changeFilter={changeFilter}
                  addTask={addTask}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolist}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitle}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

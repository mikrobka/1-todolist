import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components";
import { Todolist } from "./todolists/todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useActions } from "common/hooks";
import { selectTodolists, todolistsThunks } from "./todolists/todolist/model";
import { selectTasks } from "./tasks/model";
import { selectIsLoggedIn } from "features/auth/login/model";


export const TodolistsList = () => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const {
    addTodolist,
    fetchTodolists
  } = useActions(todolistsThunks);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    fetchTodolists(null);
  }, []);


  const addTodolistHandler = useCallback((title: string) => {
    addTodolist(title);
  }, []);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl:any) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

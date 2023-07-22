import React, { useCallback, useEffect } from "react";
import { Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Task } from "features/todolists-list/tasks/task/task";
import { TaskStatuses } from "common/enums";
import { useActions } from "common/hooks";
import { AddItemForm, EditableSpan } from "common/components";
import { tasksThunks } from "features/todolists-list/tasks/model";
import { TodolistDomainType } from "./api";
import { TaskType } from "features/todolists-list/tasks/api";
import { todolistsThunks } from "./model";
import { FilterTaskButton } from "./filter-task-button/filter-task-button";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist = React.memo(function ({ tasks, todolist }: PropsType) {
  const { fetchTasks, addTask } = useActions(tasksThunks);
  const { removeTodolist, changeTodolistTitle } = useActions(todolistsThunks);
  let tasksForTodolist = tasks;

  useEffect(() => {
    fetchTasks(todolist.id);
  }, []);

  const addTaskHandler = (title: string) => {
    return addTask({ title: title, todolistId: todolist.id }).unwrap();
  };

  const removeTodolistHandler = () => {
    removeTodolist(todolist.id);
  };

  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({ id: todolist.id, title: title });
    },
    [todolist.id, changeTodolistTitle],
  );

  if (todolist.filter === "active") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
  }
  if (todolist.filter === "completed") {
    tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
  }

  return (
    <div>
      <h3>
        <EditableSpan value={todolist.title} onChange={changeTodolistTitleHandler} />
        <IconButton onClick={removeTodolistHandler} disabled={todolist.entityStatus === "loading"}>
          <Delete />
        </IconButton>
      </h3>
      <AddItemForm addItem={addTaskHandler} disabled={todolist.entityStatus === "loading"} />
      <div>
        {tasksForTodolist.map((t) => (
          <Task key={t.id} task={t} todolistId={todolist.id} />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <FilterTaskButton todolist={todolist} />
      </div>
    </div>
  );
});

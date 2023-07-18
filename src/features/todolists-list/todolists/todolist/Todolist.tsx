import React, { useCallback, useEffect } from "react";
import { Delete } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Task } from "../../tasks/Task/Task";
import { TaskStatuses } from "common/enums";
import { useActions, useAppDispatch } from "common/hooks";
import { AddItemForm, EditableSpan } from "common/components";
import { tasksThunks } from "features/todolists-list/tasks/model";
import { FilterValuesType, TodolistDomainType } from "./api";
import { TaskType } from "features/todolists-list/tasks/api";
import { todolistsActions, todolistsThunks } from "./model";

type PropsType = {
  todolist: TodolistDomainType;
  tasks: TaskType[];
};

export const Todolist = React.memo(function ({tasks, todolist}: PropsType) {
  const { fetchTasks, addTask } = useActions(tasksThunks);
  const { removeTodolist, changeTodolistTitle, } = useActions(todolistsThunks)
  const dispatch = useAppDispatch()
  let tasksForTodolist = tasks;
  

  useEffect(() => {
    fetchTasks(todolist.id);
  }, []);

  const addTaskHandler = useCallback(
    (title: string) => {
      addTask({title: title,todolistId: todolist.id });
    },
    [addTask, todolist.id],
  );

  const removeTodolistHandler = () => {
    removeTodolist( todolist.id );
  };

  const changeFilterHandler = (filter:FilterValuesType) => {
    dispatch(todolistsActions.changeTodolistFilter({ id:todolist.id,filter: filter}))
  }


  const changeTodolistTitleHandler = useCallback(
    (title: string) => {
      changeTodolistTitle({id: todolist.id,title: title });
    },
    [todolist.id,changeTodolistTitle],
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
          <Task
            key={t.id}
            task={t}
            todolistId={todolist.id}
          />
        ))}
      </div>
      <div style={{ paddingTop: "10px" }}>
        <Button
          variant={todolist.filter === "all" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("all")}
          color={"inherit"}
        >
          All
        </Button>
        <Button
          variant={todolist.filter === "active" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("active")}
          color={"primary"}
        >
          Active
        </Button>
        <Button
          variant={todolist.filter === "completed" ? "outlined" : "text"}
          onClick={() => changeFilterHandler("completed")}
          color={"secondary"}
        >
          Completed
        </Button>
      </div>
    </div>
  );
});

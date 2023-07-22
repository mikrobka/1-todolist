import React, { ChangeEvent } from "react";
import { Checkbox, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

import { EditableSpan } from "common/components";
import { TaskStatuses } from "common/enums";
import { TaskType } from "../api";
import { useActions } from "common/hooks";
import { tasksThunks } from "../model";

type TaskPropsType = {
  task: TaskType;
  todolistId: string;
};

export const Task = React.memo(({task,todolistId}: TaskPropsType) => {

const {removeTask,updateTask  } = useActions(tasksThunks)


  const removeTaskHandler = () => {
    removeTask({ taskId: task.id, todolistId: todolistId })
  }

const onChangeHandler = 
  (e: ChangeEvent<HTMLInputElement>) => {
    let newIsDoneValue = e.currentTarget.checked;
    updateTask({
      taskId: task.id,
      domainModel:{status: newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New} ,
      todolistId: todolistId,
    });
  }

  const onTitleChangeHandler = 
    (newValue: string) => {
      updateTask({
      taskId: task.id,
      domainModel:{title: newValue} ,
      todolistId: todolistId,
    });
    }
  

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

      <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={removeTaskHandler}>
        <Delete />
      </IconButton>
    </div>
  );
});

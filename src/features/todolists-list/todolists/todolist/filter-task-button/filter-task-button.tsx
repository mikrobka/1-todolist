import Button from "@mui/material/Button"
import { useAppDispatch } from "common/hooks"
import React from "react"
import { todolistsActions } from "../model"
import { FilterValuesType, TodolistDomainType } from "../api"



type PropsType = {
    todolist: TodolistDomainType;   
}


export const FilterTaskButton = ({todolist}:PropsType) => {

    const dispatch = useAppDispatch()


   const changeFilterHandler = (filter:FilterValuesType) => {
    dispatch(todolistsActions.changeTodolistFilter({ id:todolist.id,filter: filter}))
  }

    return (
        <>
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
        </>
    )
}
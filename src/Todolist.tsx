import React, {memo, useCallback, useMemo} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import { IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task";
import {ButtonWithMemo} from "./Button";
import {FilterValuesType} from "./AppWithRedux";


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    addTask: (title: string, todolistId: string) => void
    removeTodolist: (id: string) => void
    changeTodolistTitle: (id: string, newTitle: string) => void
    filter: FilterValuesType
}

export const Todolist = memo((props: PropsType) => {
    const addTask = useCallback((title: string) => {
        props.addTask(title, props.id);
    }, [props.addTask, props.id])
    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.id);
    }, [props.removeTodolist, props.id])
    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.id, title);
    }, [props.changeTodolistTitle, props.id])

    const onAllClickHandler =useCallback (() => props.changeFilter("all", props.id),[props.changeFilter,props.id]);
    const onActiveClickHandler =useCallback (() => props.changeFilter("active", props.id),[props.changeFilter,props.id]);
    const onCompletedClickHandler =useCallback (() => props.changeFilter("completed", props.id),[props.changeFilter,props.id]);

    let tasks = props.tasks
    tasks = useMemo(()=>{
        if (props.filter === "active") {
            tasks = tasks.filter(t => !t.isDone);
        }
        if (props.filter === "completed") {
            tasks = tasks.filter(t => t.isDone);
        }
        console.log("memo")
        console.log(tasks)
        return tasks
    },[props.filter,props.tasks])



    // const removeTask = useCallback((taskId: string) => props.removeTask(taskId, props.id), [props.removeTask, props.id])
    // const changeTaskStatus = useCallback((taskId: string, newIsDoneValue: boolean) => {
    //     props.changeTaskStatus(taskId, newIsDoneValue, props.id);
    // }, [props.changeTaskStatus, props.id])
    // const changeTaskTitle = useCallback((taskId: string, newValue: string) => {
    //     props.changeTaskTitle(taskId, newValue, props.id);
    // }, [props.changeTaskTitle, props.id])

    return <div>
        <h3><EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                    tasks.map(t => {
                    return <Task key={t.id} task={t} todolistId={props.id}/>
                })
            }
        </div>
        <div style={{paddingTop: "10px"}}>
            <ButtonWithMemo variant={props.filter === 'all' ? 'outlined' : 'text'} color={'inherit'} onClick={onAllClickHandler} title={'All'}/>
            <ButtonWithMemo variant={props.filter === 'active' ? 'outlined' : 'text'} color={'primary'} onClick={onActiveClickHandler} title={'Active'}/>
            <ButtonWithMemo variant={props.filter === 'completed' ? 'outlined' : 'text'} color={'secondary'} onClick={onCompletedClickHandler} title={'Completed'}/>
        </div>
    </div>
})





import React, {useState} from 'react';
import {ButtonNameType} from "./App";

export type TaskType = {
    id: number
    title: string
    isDone: boolean
}


export type PropsType = {
    title: string
    tasks: Array<TaskType>
    removeTask: (taskId: number, myTitle: string) => void
}


export function Todolist(props: PropsType) {

    let [filterTask, setFilterTask] = useState<ButtonNameType>('All')

    const filteringTasks = (buttonName: ButtonNameType) => {
        setFilterTask(buttonName)
    }

    let filteredTasks = props.tasks
    if (filterTask === 'Action') {
        filteredTasks = props.tasks.filter(el => el.isDone)
    }
    if (filterTask === 'Completed') {
        filteredTasks = props.tasks.filter(el => !el.isDone)
    }

    return <div>
        <h3>{props.title}</h3>
        <div>
            <input/>
            <button>+</button>
        </div>
        <ul>
            {filteredTasks.map((el) => {
                return <li key={el.id}>
                    <button onClick={() => {
                        props.removeTask(el.id, "qweqwe")
                    }}>X
                    </button>
                    <input type="checkbox" checked={el.isDone}/>
                    <span>{el.title}</span>

                </li>
            })}

        </ul>
        <div>
            <button onClick={() => {
                filteringTasks('All')
            }}>All
            </button>
            <button onClick={() => {
                filteringTasks('Action')
            }}>Active
            </button>
            <button onClick={() => {
                filteringTasks('Completed')
            }}>Completed
            </button>
        </div>
    </div>
}

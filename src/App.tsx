import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';

export type ButtonNameType = 'All' | 'Action' | 'Completed'

function App() {


    let [tasks1, setTasks1] = useState<Array<TaskType>>([
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false},
        {id: 4, title: "ReactJS", isDone: false},
        {id: 5, title: "JS", isDone: true}
    ])


    const removeTask = (taskId: number, myTitle: string) => {
        setTasks1(tasks1.filter((el) => el.id !== taskId))
    }


    return (
        <div className="App">
            <Todolist
                title="What to learn"
                tasks={tasks1}
                removeTask={removeTask}
            />
            <Todolist />


        </div>
    );
}

export default App;

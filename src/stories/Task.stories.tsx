import type { Meta, StoryObj } from '@storybook/react';
import {Provider, useSelector} from "react-redux";
import {AppRootStateType, store} from "../state/store";
import React from 'react';
import {Task} from "../Task";
import {TaskType} from "../Todolist";
import {ReduxStoreProviderDecorator} from "../state/ReduxStoreProviderDecorator";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Task> = {
  title: 'ToDoLists/Task',
  component: Task,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  decorators:[ReduxStoreProviderDecorator]

};
export default meta;
type Story = StoryObj<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const TaskCopy = () => {
  const task = useSelector<AppRootStateType,TaskType>(state => state.tasks['todolistId1'][0])
  return <Task task={task} todolistId={'todolistId1'}/>
}

export const TaskStory:Story = {
  render:()=><TaskCopy/>
}

import type { Meta, StoryObj } from '@storybook/react';
import {AddItemForm, AddItemFormPropsType} from "../AddItemForm";
import {action} from '@storybook/addon-actions'
import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import TextField from "@mui/material/TextField/TextField";
import {IconButton} from "@mui/material";
import {AddBox} from "@mui/icons-material";

const meta: Meta<typeof AddItemForm> = {
  title: 'ToDoLists/AddItemForm',
  component: AddItemForm,
  tags: ['autodocs'],
  argTypes: {
    addItem:{
      description: 'Button clicked inside form',
      // action:'clicked'
    }
  },
};

export default meta;
type Story = StoryObj<typeof AddItemForm>;


export const AddItemFormStory: Story = {
  args:{
    addItem:action('Button clicked inside form')
  }
};

export const AddItemFormStoryWithError = (args:AddItemFormPropsType) => {

    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>('Title is reqired')

    const addItem = () => {
      if (title.trim() !== "") {
        args.addItem(title);
        setTitle("");
      } else {
        setError("Title is required");
      }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
      setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
      if(error) setError(null);
      if (e.charCode === 13) {
        addItem();
      }
    }

    return <div>
      <TextField variant="outlined"
                 error={!!error}
                 value={title}
                 onChange={onChangeHandler}
                 onKeyPress={onKeyPressHandler}
                 label="Title"
                 helperText={error}
      />
      <IconButton color="primary" onClick={addItem}>
        <AddBox />
      </IconButton>
    </div>

}





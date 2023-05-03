import type { Meta, StoryObj } from '@storybook/react';
import {ButtonWithMemo} from "../Button";
import {string} from "prop-types";
import {action} from "@storybook/addon-actions";


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ButtonWithMemo> = {
  title: 'ToDoLists/ButtonWithMemo',
  component: ButtonWithMemo,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    color:string,
    title:string,
    variant : string,
    onClick:{
      description:'on click',
      action:'click'
    }
  },
};

export default meta;
type Story = StoryObj<typeof ButtonWithMemo>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const PrimaryButton: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
    color:'primary',
    title:'Button',
    variant:'outlined',
    onClick:action('Click')
  },
};



import type { Meta, StoryObj } from '@storybook/react';
import {EditableSpan} from "../EditableSpan";
import {action} from "@storybook/addon-actions";



// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof EditableSpan> = {
  title: 'ToDoLists/EditableSpan',
  component: EditableSpan,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

};

export default meta;
type Story = StoryObj<typeof EditableSpan>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const EditableSpanStory: Story = {
  // More on args: https://storybook.js.org/docs/react/writing-stories/args
  args: {
      value:'Double click on me for edit span',
      onChange:action('Change value')
  },
};



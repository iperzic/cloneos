import type { Meta, StoryObj } from '@storybook/react';

import Notes from '@/apps/notes';

const meta: Meta<typeof Notes> = {
  title: 'Apps/Notes',
  component: Notes,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Notes>;

export const Default: Story = {};

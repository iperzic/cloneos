import type { Meta, StoryObj } from '@storybook/react';

import Calculator from '@/apps/calculator';

const meta: Meta<typeof Calculator> = {
  title: 'Apps/Calculator',
  component: Calculator,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Calculator>;

export const Default: Story = {};

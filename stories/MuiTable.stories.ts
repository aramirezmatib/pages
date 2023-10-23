import MuiTable from '../app/components/components/MuiTable';
import type { Meta, StoryObj } from '@storybook/react';


// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: 'Components/MuiTable',
  component: MuiTable,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} satisfies Meta<typeof MuiTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    endpoint: "https://kpionline10.bitam.com/eBavel6_test/api/v1/fbm_bmd_0586/data/FRM_69EA2207/FRMW_00F80780?api_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJCSVRBTSJ9.OEt5XDgtcDwkPHl6K10mPCFyeTs1djY8JDx5cigrJ3EpKHlnWjhLeUkuLT9FNV91Png9QmV4QCtMLy15Ry4sXT94PUE8LkBxRjVAJz82YSdCNcK_N3AvLHk7N8K_K0Uhwr8jSDUoeEV4QHE7NmEjYTVheT54PUE8Jj11XCZ2XEvCoXN4THg8STwuQHlIN2EjPzY-L0I1wr83PzZAcUs0LGNceD1BPMKhdic8wqFzcTvCoT0mYyRzcGIkKTZfLyl5PSMpNlwjTHhiwqFMeF0jTHnCvy5fJl8uKXE-wqE9L8K_wqFzKkkuwr91PsKhXy5iJCx0XC4pK8K_wqFfeTwvc3BKwqFMLkwuS3lnIXJ5Pzh3cDwkPXRfJCk2S8KhTC5LJHN5Z2U.",
    view: "FRMW_00F80780",
  },
};
// demo-button.stories.js

import { html } from 'lit-html';

import './index';

export default {
  title: 'Example/Input',
  argTypes: {
    backgroundColor: { control: 'color' },
    value: { control: 'string | number', description: '受控值' },
    onClick: { action: 'onClick' },
  },
};


//👇 We create a “template” of how args map to rendering
const Template = ({ primary, label }) =>
  html`<wheat-input ?primary=${primary} .label=${label}>123s</wheat-input>`;

//👇 Each story then reuses that template
export const Primary = Template.bind({});

Primary.args = {
  primary: true,
  label: 'Input',
};

// demo-button.stories.js
// https://storybook.js.org/docs/react/writing-docs/doc-blocks
//https://storybook.js.org/docs/react/essentials/controls
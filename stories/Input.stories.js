// demo-button.stories.js

import { html } from 'lit-html';

import '../input';

export default {
  title: 'Example/Input',
  argTypes: {
    backgroundColor: { control: 'color' },
    onClick: { action: 'onClick' },
  },
};


//👇 We create a “template” of how args map to rendering
const Template = ({ primary, label }) =>
  html`<wheat-input ?primary=${primary} .label=${label}></wheat-input>`;

//👇 Each story then reuses that template
export const Primary = Template.bind({});

Primary.args = {
  primary: true,
  label: 'Button',
};


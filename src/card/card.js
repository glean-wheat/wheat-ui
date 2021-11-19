import {LitElement, css, html} from 'lit';
import * as styleContent from './card.scss'
import { parseCss, watchAttributess } from '../utils/utils'

export class WheatCard extends LitElement {
  static properties = {
    name: {},
  };
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
  ${parseCss(styleContent)}
  `;

  constructor() {
    super();
    // Declare reactive properties
    this.name = 'World';
  }

  // Render the UI as a function of component state
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

customElements.define('wheat-card', WheatCard);
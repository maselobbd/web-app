import { CustomStylesAndAttributes } from './customStylesAndAttributes.js';

const entryItem = document.querySelector(CustomStylesAndAttributes.ENTRY_ITEM);
const checkbox = document.createElement(CustomStylesAndAttributes.CHECKBOX_TAG);
checkbox.setAttribute('type', CustomStylesAndAttributes.CHECKBOX_TYPE);
checkbox.setAttribute('id', CustomStylesAndAttributes.CHECKBOX_SELECTOR);
checkbox.style.margin = CustomStylesAndAttributes.CHECKBOX_MARGIN;

const label = document.createElement(CustomStylesAndAttributes.LABEL);
label.setAttribute('for', CustomStylesAndAttributes.CHECKBOX_SELECTOR);
label.appendChild(document.createTextNode(CustomStylesAndAttributes.LABEL_VALUE));

const div = document.createElement(CustomStylesAndAttributes.DIV);
div.appendChild(checkbox);
div.appendChild(label);

div.style = CustomStylesAndAttributes.DIV_STYLE
label.style = CustomStylesAndAttributes.LABEL_STYLE;

entryItem.insertAdjacentElement(CustomStylesAndAttributes.DIV_POSITION, div);

function toggle() {
    const passwordField = document.querySelector(CustomStylesAndAttributes.PASS_INPUT);
    if(passwordField.type === CustomStylesAndAttributes.PASS_TYPE){
        passwordField.type = CustomStylesAndAttributes.TEXT_TYPE;
    } else {
        passwordField.type = CustomStylesAndAttributes.PASS_TYPE;
    }
  }

checkbox.addEventListener(CustomStylesAndAttributes.EVENT, toggle)
import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import Button from '@atlaskit/button';

export default class General extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Button appearance="primary">Primary button</Button>
      </div>
    );
  }
}


window.addEventListener('load', function() {

    const wrapper = document.getElementById("container");
    wrapper ? ReactDOM.render(<General />, wrapper) : false;
});
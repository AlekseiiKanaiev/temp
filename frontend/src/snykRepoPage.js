import React, { Component } from "react";
import ReactDOM from "react-dom";
import ProjectList from "./components/ProjectList";

export default class SnykRepoPage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <ProjectList apiKey={"4a18d42f-0706-4ad0-b127-24078731fbed"} />
      </div>
    );
  }
}

window.addEventListener("load", function () {
  const wrapper = document.getElementById("container");
  wrapper ? ReactDOM.render(<SnykRepoPage />, wrapper) : false;
});

import React from 'react';
import ReactDOM from 'react-dom';
import ProjectList from './components/ProjectList';

export default function SnykRepoPage({jwtToken}) {
  return (
    <div>
      <ProjectList apiKey={jwtToken} />
    </div>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  const jwtToken = document.getElementById("jwttoken").value
  wrapper ? ReactDOM.render(<SnykRepoPage jwtToken={jwtToken} />, wrapper) : false;
});

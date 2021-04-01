import React from 'react';
import ReactDOM from 'react-dom';
import ProjectList from './components/ProjectList';

export default function SnykRepoPage() {
  return (
    <div>
      <ProjectList apiKey="4a18d42f-0706-4ad0-b127-24078731fbed" />
    </div>
  );
}

window.addEventListener('load', () => {
  const wrapper = document.getElementById('container');
  wrapper ? ReactDOM.render(<SnykRepoPage />, wrapper) : false;
});

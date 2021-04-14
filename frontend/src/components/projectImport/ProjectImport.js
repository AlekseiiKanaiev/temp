import React, { useState } from 'react';
import ProjectImportPage from './ProjectImportPage';
import ProjectImportProgress from './ProjectImportProgress';

export default function ProjectImport({ jwtToken }) {
  const [isImporting, setIsImporting] = useState(false);

  if (isImporting) {
    return <ProjectImportProgress />;
  }
  return <ProjectImportPage callback={setIsImporting} jwtToken={jwtToken} />;
}

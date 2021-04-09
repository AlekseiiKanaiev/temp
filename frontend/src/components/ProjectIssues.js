import React, { useEffect, useState } from 'react';
import { getIssues } from '../services/SnykService';
import Spinner from './Spinner';
import IssueCard from './issueCard/IssueCard';

export default function ProjectIssues({ jwtToken, projectId }) {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    if (projectId) {
      getIssues(jwtToken, projectId).then((result) => {
        setIssues(result.issues);
      });
    }
  }, [projectId, jwtToken]);

  const view = issues.length === 0 ? (
    <Spinner />
  ) : (
    issues.map((issue) => <IssueCard issue={issue} />)
  );

  return view;
}

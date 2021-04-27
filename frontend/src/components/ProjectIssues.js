import React, { useEffect, useState } from 'react';
import { getIssues } from '../services/SnykService';
import Spinner from './Spinner';
import IssueCard from './issueCard/IssueCard';
import ErrorPage from './ErrorPage';

export default function ProjectIssues({ jwtToken, projectId }) {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (projectId) {
      getIssues(jwtToken, projectId).then((result) => {
        if (result.error) {
          setError(`${result.status} ${result.body}`);
        } else {
          setIssues(result.body.issues);
        }
      }).catch((err) => {
        throw new Error(err);
      });
    }
  }, [projectId, jwtToken]);

  const view = () => {
    if (error) {
      return <ErrorPage error={error} />;
    }
    return issues.length === 0 ? (
      <Spinner />
    ) : (
      issues.map((issue) => <IssueCard issue={issue} />)
    );
  };
  return view();
}

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getIssues,
  sendToAnalytics,
} from '../services/SnykService';
import Spinner from './Spinner';
import IssueCard from './issueCard/IssueCard';
import ErrorPage from './routing/ErrorPage';

const SizedDiv = styled.div`
  width: 860px;
  margin: 20px;
`;

const compareIssues = (a, b) => {
  const sortList = ['critical', 'high', 'medium', 'low'];
  if (sortList.indexOf(a.issueData.severity) < sortList.indexOf(b.issueData.severity)) {
    return -1;
  }
  if (sortList.indexOf(a.issueData.severity) > sortList.indexOf(b.issueData.severity)) {
    return 1;
  }
  return 0;
};

export default function ProjectIssues({
  jwtToken,
  projectId,
  projectLink,
  repoOwner,
  repoSlug,
  currentUserId,
  projectName,
}) {
  const [issues, setIssues] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (projectId) {
      getIssues(jwtToken, projectId)
        .then((result) => {
          if (result.error) {
            setError(result.message);
          } else {
            setIssues(result.issues);
            sendToAnalytics(jwtToken, {
              type: 'track',
              eventMessage: {
                event: 'connect_app_page_view',
                properties: {
                  bb_user_id: currentUserId,
                  viewed_page: 'list_of_issues',
                  repo_slug: `${repoOwner}/${repoSlug}`,
                  number_of_issues: result.issues.length,
                  project_id: projectId,
                  project_path: `${repoSlug}/${projectName}`,
                },
              },
            });
          }
        })
        .catch((err) => {
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
      issues.sort(compareIssues).map((issue) => (
        <IssueCard issue={issue} projectLink={projectLink} />
      ))
    );
  };
  return <SizedDiv>{view()}</SizedDiv>;
}

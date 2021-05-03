import React, { useState } from 'react';
import ProjectImportPage from './ProjectImportPage';
import ImportRepositorySpinner from './ImportRepositorySpinner';
import {
  getImportJobDetails,
  sendToAnalytics,
} from '../../services/SnykService';

let intervalObj = 0;

export default function ProjectImport({
  jwtToken,
  repoOwner,
  repoSlug,
  repoMainBranch,
  refreshProjects,
  setErrorsOnImport,
  skipImportProjectPage,
}) {
  const eventMessage = {
    type: 'track',
    eventMessage: {
      userId: '{snykorgid}',
      event: 'connect_app_repo_imported',
      properties: {
        client_key: '{clientkey}',
        workspace_name: '{workspacename}',
        workspace_id: '{workspaceid}',
        bb_user_id: '{bbuserid}',
        snyk_user_id: '{snykuserid}',
        snyk_org_id: '{snykorgid}',
        repo_slug: repoSlug,
        import_result: 'error',
      },
    },
  };

  const [isImporting, setIsImporting] = useState(false);
  const afterRepoImportedAction = (result, errorOnImport) => {
    if (errorOnImport) {
      sendToAnalytics(jwtToken, eventMessage);
      setErrorsOnImport(errorOnImport);
    } else {
      const jobUrl = getJobUrl(result);
      if (jobUrl === '') {
        sendToAnalytics(jwtToken, eventMessage);
        setErrorsOnImport('Job url not found in the location header');
      } else {
        const interval = setInterval(() => {
          checkJob(jobUrl);
        }, 4000);
        intervalObj = interval;
      }
    }
  };

  const checkJob = (jobId) => {
    getImportJobDetails(jwtToken, jobId).then((result) => {
      if (result.error) {
        sendToAnalytics(jwtToken, eventMessage);
        setErrorsOnImport(result.message);
      } else if (result.status) {
        if ((result.status === 'complete') || (result.status === 'pending' && result.logs && result.logs.length > 0 && result.logs[0].status === 'complete')) {
          clearInterval(intervalObj);
          refreshProjects(true);
        }
        if (result.status === 'failed' || result.status === 'aborted') {
          clearInterval(intervalObj);
          sendToAnalytics(jwtToken, eventMessage);
          setErrorsOnImport(`job status ${result.status}`);
        }
      } else {
        sendToAnalytics(jwtToken, eventMessage);
        setErrorsOnImport(`job status ${result.status}`);
      }
    });
  };

  const getJobUrl = (result) => {
    const re = /org\/(.+)$/g;
    const location = re.exec(result.location);
    if (!location || location.length === 0) {
      return '';
    }
    return location[0];
  };

  if (isImporting) {
    return <ImportRepositorySpinner />;
  }
  return (
    <ProjectImportPage
      setIsImporting={setIsImporting}
      callback={afterRepoImportedAction}
      jwtToken={jwtToken}
      repoOwner={repoOwner}
      repoSlug={repoSlug}
      repoMainBranch={repoMainBranch}
      skipImportProjectPage={skipImportProjectPage}
    />
  );
}

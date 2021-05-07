import React, { useState,useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import ImportRepositorySpinner from './ImportRepositorySpinner';
import { importProject } from '../../services/SnykService';
import { setError } from '../store/actions';
import { getImportJobDetails,
         sendToAnalytics } from '../../services/SnykService';
import { dispatchProjects } from '../store/dispatchers';

let intervalObj = 0;

const ImageWrapper = styled.div`
  margin-top: 50px;
  height: 400px;
  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div`
  text-align: center;
`;

const ButtonWrapper = styled.div`
  margin-top: 30px;
  margin-bottom: 100px;
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

const H1TextWrapper = styled.h1`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 20px;
  line-height: 24px;
`;

const TextWrapper = styled.p`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
`;

export default function ProjectImport() {
  const [isImporting, setIsImporting] = useState(false);
  const configuration = useSelector((state) => state.configuration);
  const { jwtToken, repoOwner, repoSlug, repoMainBranch, currentUserId } = configuration;
  const { skipImportPage } = useSelector((state) => state.integration);
  const dispatch = useDispatch();
  const eventMessage = {
    type: 'track',
    eventMessage: {
      event: 'connect_app_repo_imported',
      properties: {
        bb_user_id: currentUserId,
        repo_slug: `${repoOwner}/${repoSlug}`,
        import_result: 'error',
      },
    },
  };

  useLayoutEffect(() => {
    sendToAnalytics(jwtToken,{
      type: 'track',
      eventMessage: {
        event: 'connect_app_page_view',
        properties: {
          bb_user_id: currentUserId,
          viewed_page: 'add_repo',
          repo_slug: `${repoOwner}/${repoSlug}`,
        },
      }  
      })
  })

  const importProjectToSnyk = () => {
    setIsImporting(true);
    importProject(jwtToken, repoOwner, repoSlug, repoMainBranch).then(
      (result) => {
        if (result.error) {
          afterRepoImportedAction(result, result.message);
        } else if (!result.location) {
          afterRepoImportedAction(
            result,
            'Location not found in the response header'
          );
        } else {
          afterRepoImportedAction(result, '');
        }
      }
    );
  };

  const afterRepoImportedAction = (result, errorOnImport) => {
    if (errorOnImport) {
      sendToAnalytics(jwtToken, eventMessage);
      dispatch(
        setError({
          error: 'Error importing this repository.',
          message: errorOnImport,
        })
      );
    } else {
      const jobUrl = getJobUrl(result);
      if (jobUrl === '') {
        sendToAnalytics(jwtToken, eventMessage);
        dispatch(
          setError({
            error: 'Error importing this repository.',
            message: 'Job url not found in the location header',
          })
        );
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
        dispatch(
          setError({
            error: 'Error importing this repository.',
            message: result.message,
          })
        );
      } else if (result.status) {
        if (
          result.status === 'complete' ||
          (result.status === 'pending' &&
            result.logs &&
            result.logs.length > 0 &&
            result.logs[0].status === 'complete')
        ) {
          clearInterval(intervalObj);
          dispatchProjects(dispatch, configuration, true);
        }
        if (result.status === 'failed' || result.status === 'aborted') {
          clearInterval(intervalObj);
          sendToAnalytics(jwtToken, eventMessage);
          dispatch(
            setError({
              error: 'Error importing this repository.',
              message: `job status ${result.status}`,
            })
          );
        }
      } else {
        sendToAnalytics(jwtToken, eventMessage);
        dispatch(
          setError({
            error: 'Error importing this repository.',
            message: `job status ${result.status}`,
          })
        );
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

  if (!isImporting && skipImportPage) {
    importProjectToSnyk();
  }
  if (isImporting) {
    return <ImportRepositorySpinner />;
  }
  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ImageWrapper>
          <img src='/ico/addRepository.svg' alt='Add Repository' />
        </ImageWrapper>
        <H1TextWrapper>Add your repository to Snyk</H1TextWrapper>
        <TextWrapper>
          Import your repository to Snyk to find security issues and to
          continuously monitor your repo for vulnerabilities
        </TextWrapper>
        <ButtonWrapper>
          <Button appearance='primary' onClick={importProjectToSnyk}>
            Import this repository
          </Button>
        </ButtonWrapper>

        <TextWrapper>
          To bulk import repositories from your account, open the&nbsp;
          <a href='#'>Add project dialog</a> in Snyk app
        </TextWrapper>
      </ContentWrapper>
    </GridColumn>
  );
}
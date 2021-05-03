import { GridColumn } from '@atlaskit/page';
import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { importProject } from '../../services/SnykService';

export default function ProjectImportPage({
  setIsImporting,
  callback,
  jwtToken,
  repoOwner,
  repoSlug,
  repoMainBranch,
  skipImportProjectPage,
}) {
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

  const importProjectToSnyk = () => {
    setIsImporting(true);
    importProject(jwtToken, repoOwner, repoSlug, repoMainBranch).then(
      (result) => {
        if (result.error) {
          callback(result, result.message);
        } else if (!result.location) {
          callback(result, 'Location not found in the response header');
        } else {
          callback(result, '');
        }
      },
    );
  };

  if (skipImportProjectPage) {
    importProjectToSnyk();
  }

  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ImageWrapper>
          <img src="/ico/addRepository.svg" alt="Add Repository" />
        </ImageWrapper>
        <H1TextWrapper>Add your repository to Snyk</H1TextWrapper>
        <TextWrapper>
          Import your repository to Snyk to find security issues and to
          continuously monitor your repo for vulnerabilities
        </TextWrapper>
        <ButtonWrapper>
          <Button appearance="primary" onClick={importProjectToSnyk}>
            <TextWrapper>Import this repository</TextWrapper>
          </Button>
        </ButtonWrapper>

        <TextWrapper>
          To bulk import repositories from your account, open the&nbsp;
          <a href="#">Add project dialog</a>
          {' '}
          in Snyk app
        </TextWrapper>
      </ContentWrapper>
    </GridColumn>
  );
}

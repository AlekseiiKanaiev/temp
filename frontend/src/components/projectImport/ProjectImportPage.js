import { GridColumn } from '@atlaskit/page';
import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { importProject } from '../../services/SnykService';

export default function ProjectImportPage({ callback, jwtToken }) {
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

  const importProjectToSnyk = () => {
    importProject(jwtToken).then((result) => callback(true));
  };

  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ImageWrapper>
          <img src="/ico/addRepository.svg" alt="Add Repository" />
        </ImageWrapper>
        <h1>Add your repository to Snyk</h1>
        <p>
          Import your repository to Snyk to find security issues and to
          continuously monitor your repo for vulnerabilities
        </p>
        <ButtonWrapper>
          <Button appearance="primary" onClick={importProjectToSnyk}>Import this repository</Button>
        </ButtonWrapper>
        <p>
          To bulk import repositories from your account, open the&nbsp;
          <a href="#">Add project dialog</a>
          {' '}
          in Snyk app
        </p>
      </ContentWrapper>
    </GridColumn>
  );
}

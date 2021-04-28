import React from 'react';
import { GridColumn } from '@atlaskit/page';
import styled from 'styled-components';
import Spinner from '../Spinner';

const ContainerWrapper = styled.div`
  min-width: 650px;
  max-width: 650px;
  height: 350px;
  margin-top: 30px;
  margin-bottom: 5%;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: block;
  text-align: center;
`;

const ContentWrapper = styled.div`
  display: inline-block;
`;

const TextWrapper = styled.p`
  font-family: 'Open Sans';
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  line-height: 24px;
`;

export default function ImportRepositorySpinner() {
  return (
    <GridColumn medium={12}>
      <ContainerWrapper>
        <ContentWrapper>
          <Spinner />
          <TextWrapper>
            Importing your repository to Snyk and scanning it for
            vulnerabilities...
          </TextWrapper>
        </ContentWrapper>
      </ContainerWrapper>
    </GridColumn>
  );
}

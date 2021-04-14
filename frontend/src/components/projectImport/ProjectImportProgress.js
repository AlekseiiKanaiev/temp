import { GridColumn } from '@atlaskit/page';
import React from 'react';
import styled from 'styled-components';
import ProgressBar from '@atlaskit/progress-bar';

export default function ProjectImportProgress() {
  const ContentWrapper = styled.div`
    text-align: center;
  `;

  return (
    <GridColumn medium={12}>
      <ContentWrapper>
        <ProgressBar progress={1} />
      </ContentWrapper>
    </GridColumn>
  );
}

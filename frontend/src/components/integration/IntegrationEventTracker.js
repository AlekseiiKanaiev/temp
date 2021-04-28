import React from 'react';
import styled from 'styled-components';
import { ProgressTracker } from '@atlaskit/progress-tracker';

const TextWrapper = styled.label`
  font-family: 'Open Sans';
  font-weight: 700;
  font-style: normal;
  font-size: 14px;
  line-height: 16px;
`;

export default function IntegrationEventTracker({ stage }) {
  const stagesList = ['Log in or sign up to Snyk', 'Integrate with Snyk'];

  const items = stagesList.map((item, idx) => {
    const wrapped = <TextWrapper>{item}</TextWrapper>;

    if (idx < stage) {
      return {
        id: `stage-${idx}`,
        label: wrapped,
        percentageComplete: 100,
        status: 'visited',
      };
    }
    if (idx === stage) {
      return {
        id: `stage-${idx}`,
        label: wrapped,
        percentageComplete: 0,
        status: 'current',
      };
    }
    return {
      id: `stage-${idx}`,
      label: wrapped,
      percentageComplete: 0,
      status: 'unvisited',
    };
  });

  return <ProgressTracker items={items} />;
}

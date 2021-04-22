import React from 'react';
import { ProgressTracker } from '@atlaskit/progress-tracker';

export default function IntegrationEventTracker({ stage }) {
  const stagesList = [
    'Log in or sign up to Snyk',
    'Integrate with Snyk',
  ];

  const items = stagesList.map((item, idx) => {
    if (idx < stage) {
      return {
        id: `stage-${idx}`,
        label: item,
        percentageComplete: 100,
        status: 'visited',
      };
    } if (idx === stage) {
      return {
        id: `stage-${idx}`,
        label: item,
        percentageComplete: 0,
        status: 'current',
      };
    }
    return {
      id: `stage-${idx}`,
      label: item,
      percentageComplete: 0,
      status: 'unvisited',
    };
  });

  return <ProgressTracker items={items} />;
}

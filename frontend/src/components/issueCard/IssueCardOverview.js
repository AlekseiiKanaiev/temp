import React from 'react';
import styled from 'styled-components';

export default function IssueCardOverview({ issue }) {
  const OverviewTextWrapper = styled.p`
    white-space: pre-line;
  `;

  const overview = () => {
    const overviewRegExp = /## Overview([\s\S]*?)(?=##)/m;
    const linkRegExp = /(\[\S+\]\(\S+\))/g;
    let unformatedOverview = 'no desc found';
    if (issue.issueData.description) {
      const overviewMatches = overviewRegExp.exec(issue.issueData.description);
      unformatedOverview = overviewMatches && overviewMatches[1];
      unformatedOverview = unformatedOverview || issue.issueData.description;
    }
    const links = unformatedOverview.match(linkRegExp);
    let linksInDescription = '';
    if (links) {
      linksInDescription = unformatedOverview.split(linkRegExp)
        .map((part) => (links.find((link) => link === part) ? (
          <a href={part.substring(part.indexOf('(') + 1, part.indexOf(')'))}>
            {part.substring(part.indexOf('[') + 1, part.indexOf(']'))}
          </a>
        ) : (
          part
        )));
    }
    return links
      ? linksInDescription
      : [unformatedOverview];
  };

  return (
    <>
      <h3>Overview</h3>
      <OverviewTextWrapper>
        {overview().map((part) => part)}
      </OverviewTextWrapper>
    </>
  );
}

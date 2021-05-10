import React from 'react';
import styled from 'styled-components';

export default function IssueCardOverview({ issue }) {
  const OverviewTextWrapper = styled.p`
    white-space: pre-line;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 12px;
    line-height: 22px;
  `;

  const H3TextWrapper = styled.h3`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-weight: 600;
    font-style: normal;
    font-size: 14px;
    line-height: 28px;
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
    unformatedOverview = unformatedOverview.trim().replace(/(\n+)/gm, '\n');
    const links = unformatedOverview.match(linkRegExp);
    let linksInDescription;
    if (links) {
      linksInDescription = unformatedOverview
        .split(linkRegExp)
        .map((part) => (links.find((link) => link === part) ? (
          <a href={part.substring(part.indexOf('(') + 1, part.indexOf(')'))}>
            {part.substring(part.indexOf('[') + 1, part.indexOf(']'))}
          </a>
        ) : (
          part.trim().replace(/(\n+)/gm, '\n')
        )));
      linksInDescription = linksInDescription.filter((part) => part && part !== '\n');
      return linksInDescription;
    }
    return [unformatedOverview];
  };

  return (
    <>
      <H3TextWrapper>Overview</H3TextWrapper>
      <OverviewTextWrapper>
        {overview().map((part) => part)}
      </OverviewTextWrapper>
    </>
  );
}

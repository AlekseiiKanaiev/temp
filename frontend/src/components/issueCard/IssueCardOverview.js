import React from 'react';
import styled from 'styled-components';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
});

export default function IssueCardOverview({ issue }) {
  const OverviewTextWrapper = styled.p`
    white-space: pre-line;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-weight: 400;
    font-style: normal;
    font-size: 14px;
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
    let unformatedOverview = '';
    if (issue.issueData.description) {
      const overviewMatches = overviewRegExp.exec(issue.issueData.description);
      unformatedOverview = overviewMatches && overviewMatches[1];
      unformatedOverview = unformatedOverview || issue.issueData.description;
    }
    return unformatedOverview;
  };

  const createMarkup = () => {
    const overviewPart = overview();
    const htmlOutput = overviewPart ? md.renderInline(overviewPart) : '';
    return {
      __html: htmlOutput.replace(/(<a\s)/gm, '<a target="_blank"')
        .trim()
        .replace(/(\n+)/gm, '\n'),
    };
  };

  return (
    <>
      <H3TextWrapper>Overview</H3TextWrapper>
      <OverviewTextWrapper>
        <div dangerouslySetInnerHTML={createMarkup()} />
      </OverviewTextWrapper>
    </>
  );
}

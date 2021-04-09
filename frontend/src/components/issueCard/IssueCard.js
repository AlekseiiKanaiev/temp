import React from 'react';
import styled from 'styled-components';
import IssueCardBadge from './IssueCardBadge';
import IssueCardVulnarability from './IssueCardVulnerability';
import IssueCardInfo from './IssueCardInfo';
import IssueCardOverview from './IssueCardOverview';
import IssueCardAdditionalInfo from './IssueCardAdditionalInfo';

export default function IssueCard({ issue }) {
  const LineWrapper = styled.div`
    margin-top: 10px;
    margin-bottom: 20px;
  `;

  const CardWrapper = styled.div`
    margin: 20px;
    border: 1px solid #ccc;
  `;

  const SectionWrapper = styled.div`
    margin: 20px;
    border-bottom: 1px solid #ccc;
  `;

  return (
    <CardWrapper>
      <SectionWrapper>
        <LineWrapper>
          <IssueCardBadge issue={issue} />
        </LineWrapper>
        <LineWrapper>
          <IssueCardVulnarability issue={issue} />
        </LineWrapper>
      </SectionWrapper>
      <SectionWrapper>
        <IssueCardInfo issue={issue} />
      </SectionWrapper>
      <SectionWrapper>
        <IssueCardOverview issue={issue} />
      </SectionWrapper>
      <IssueCardAdditionalInfo issue={issue} />
    </CardWrapper>
  );
}

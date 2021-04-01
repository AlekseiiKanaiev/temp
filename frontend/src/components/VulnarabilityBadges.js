import React from 'react';
import PropTypes from 'prop-types';
import VulnerabilityBadge from './VulnerabilityBadge';

export default function VulnarabilityBadges({ issueCounts }) {
  return (
    <>
      <VulnerabilityBadge color="red" data={issueCounts.high} />
      <VulnerabilityBadge color="yellow" data={issueCounts.medium} />
      <VulnerabilityBadge color="black" data={issueCounts.low} />
    </>
  );
}

VulnarabilityBadges.propTypes = {
  issueCounts: PropTypes.shape({
    high: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
  }).isRequired,
};

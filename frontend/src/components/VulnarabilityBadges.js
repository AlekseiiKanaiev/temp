import React from 'react';
import PropTypes from 'prop-types';
import VulnerabilityBadge from './VulnerabilityBadge';

export default function VulnarabilityBadges({ issueCounts }) {
  const isCriticaEnabled = Object.prototype.hasOwnProperty.call(issueCounts, 'critical') && issueCounts.critical !== -1;
  return (
    <div style={{ display: 'flex' }}>
      {isCriticaEnabled && <VulnerabilityBadge color="redc" data={issueCounts.critical} isCriticaEnabled={isCriticaEnabled} />}
      <VulnerabilityBadge color="red" data={issueCounts.high} isCriticaEnabled={isCriticaEnabled} />
      <VulnerabilityBadge color="yellow" data={issueCounts.medium} isCriticaEnabled={isCriticaEnabled} />
      <VulnerabilityBadge color="black" data={issueCounts.low} isCriticaEnabled={isCriticaEnabled} />
    </div>
  );
}

VulnarabilityBadges.propTypes = {
  issueCounts: PropTypes.shape({
    high: PropTypes.number.isRequired,
    medium: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    critical: PropTypes.number,
  }).isRequired,
};

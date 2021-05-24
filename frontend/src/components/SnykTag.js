import React from 'react';
import Tooltip from '@atlaskit/tooltip';
import './SnykTag.scss';

export default function SnykTag({ color, text, width }) {
  const getColor = (color) => {
    switch (color) {
      case 'low':
        return '#86859d';
      case 'medium':
        return '#d68100';
      case 'high':
        return '#cc4f19';
      case 'critical':
        return '#ad1a1a';
      default:
        return color;
    }
  };

  const toolTipContent = 'A vulnerability\'s severity (critical, high, medium or low) is based on its CVSS score:\n- CVSS score of -10: Critical or High\n- CVSS score of 4-6.9: Medium\n- CVSS score of 0-3.9: Low';

  return (
    <Tooltip content={toolTipContent}>
      <span className="custom-bage" style={{ backgroundColor: getColor(color), width }}>
        {text}
      </span>
    </Tooltip>
  );
}

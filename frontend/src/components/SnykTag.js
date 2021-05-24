import React from 'react';
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

  return (
    <span className="custom-bage" style={{ backgroundColor: getColor(color), width }}>
      {text}
    </span>
  );
}

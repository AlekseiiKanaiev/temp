import React from 'react';
import styled from 'styled-components';

const CustomBadge = styled.span`
  border-radius: 3px;
  cursor: default;
  display: inline-flex;
  height: 20px;
  line-height: 1.3;
  margin: 4px;
  padding: 0px;
  text-transform: capitalize;
  vertical-align: middle;
  justify-content: center;
  font-weight: 400;
  width: 20px;
  color: white;
`;

export default function SnykTag({ color, text, width }) {
  const getColor = (color) => {
    switch (color) {
      case 'low':
        return '#86859d';
      case 'medium':
        return '#d68100';
      case 'high':
        return '#cc4f19';
      default:
        return color;
    }
  };

  return (
    <CustomBadge style={{ backgroundColor: getColor(color), width }}>
      {text}
    </CustomBadge>
  );
}

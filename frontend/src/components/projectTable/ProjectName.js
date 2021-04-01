import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export default function ProjectName({ name, type }) {
  const ImageWrapper = styled.span`
    margin-right: 10px;
    vertical-align: middle;
  `;

  let icon = `${type}.svg`;
  if (type.startsWith('go') && !type.startsWith('google')) {
    icon = 'go.svg';
  } else if (type.startsWith('yarn')) {
    icon = 'yarn.svg';
  }

  return (
    <>
      <ImageWrapper>
        <img src={`/ico/${icon}`} alt={type} />
      </ImageWrapper>
      <a href="#">{name}</a>
    </>
  );
}

ProjectName.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

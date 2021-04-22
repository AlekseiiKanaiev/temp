import React from 'react';
import styled from 'styled-components';

export default function ProjectName({
  name, type, id, callback,
}) {
  const ImageWrapper = styled.span`
    margin-right: 10px;
    vertical-align: middle;
  `;

  const LinkWrapper = styled.span`
    cursor: pointer;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
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
      <LinkWrapper onClick={() => callback(id)}>{name.substring(name.indexOf(":") + 1)}</LinkWrapper>
    </>
  );
}

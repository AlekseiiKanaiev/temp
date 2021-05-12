import React from 'react';
import styled from 'styled-components';

const ImageWrapper = styled.span`
  margin-right: 10px;
  vertical-align: middle;
`;

const TextWrapper = styled.span`
  vertical-align: text-bottom;
`;

const LinkWrapper = styled.a`
  color: rgb(107, 119, 140) !important;
`;

export default function ProjectName({
  name, type, id, baseUrl, repoSlug,
}) {
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
      {repoSlug && (
      <TextWrapper>
          {'Security insights for '}
        <LinkWrapper href={`${baseUrl}`} target="_parent">
          {repoSlug}
        </LinkWrapper>
        /
        {name.substring(name.indexOf(':') + 1)}
      </TextWrapper>

      )}
      {!repoSlug && (
        <LinkWrapper href={`${baseUrl}?projectId=${id}`} target="_parent">
          {name.substring(name.indexOf(':') + 1)}
        </LinkWrapper>
      )}
    </>
  );
}

import React from 'react';
import styled from 'styled-components';

export default function ProjectName({ name, type, id, baseUrl, repoSlug }) {
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
      {repoSlug && (
        <>
          <a href={`${baseUrl}`} target='_parent'>
            {repoSlug}
          </a>
          /{name.substring(name.indexOf(':') + 1)}
        </>
      )}
      {!repoSlug && (
        <a href={`${baseUrl}?projectId=${id}`} target='_parent'>
          {name.substring(name.indexOf(':') + 1)}
        </a>
      )}
    </>
  );
}
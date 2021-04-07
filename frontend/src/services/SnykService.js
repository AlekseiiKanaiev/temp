const defaultProjectsBody = {
  filters: {
    tags: {
      includes: [
        {
          key: 'example-tag-key',
          value: 'example-tag-value',
        },
      ],
    },
    attributes: {
      criticality: ['high'],
      environment: ['backend'],
      lifecycle: ['development'],
    },
  },
};

const defaultIssuesBody = {
  includeDescription: true,
  includeIntroducedThrough: true,
  filters: {
    severities: ['high', 'medium', 'low'],
    exploitMaturity: [
      'mature',
      'proof-of-concept',
      'no-known-exploit',
      'no-data',
    ],
    types: ['vuln', 'license'],
    ignored: false,
    patched: false,
    priority: {
      score: {
        min: 0,
        max: 1000,
      },
    },
  },
};

const defaultImportProjectBody = {
  target: {
    owner: 'snyk',
    name: 'goof',
    branch: 'master',
  },
};

export async function getProjects(jwtToken) {
  const url = '/snyk/org/orgid/projects';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(defaultProjectsBody),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function getIssues(jwtToken, id) {
  const url = `/snyk/org/orgid/project/${id}/aggregated-issues`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(defaultIssuesBody),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function importProject(jwtToken) {
  const integrationId = await getIntegrationId(jwtToken);
  if (integrationId === '') {
    throw new Error('integration is not set');
  }
  const url = `/snyk/org/orgid/integrations/${integrationId}/import`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(defaultImportProjectBody),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

export async function getIntegrationId(jwtToken) {
  const url = '/snyk/org/orgid/integrations';
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `JWT ${jwtToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  const resJson = await res.json();
  return !('bitbucket-cloud' in resJson) ? '' : resJson['bitbucket-cloud'];
}

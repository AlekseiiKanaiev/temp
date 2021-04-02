const defaultBody = {
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

export default async function getProjects(apiKey) {
  //const url = `https://private-anon-7156f113fb-snyk.apiary-mock.com/api/v1/org/${apiKey}/projects`;
  const url = `/snyk/org/orgid/projects`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `JWT ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(defaultBody),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch POST ${url}, received ${res}`);
  }
  return res.json();
}

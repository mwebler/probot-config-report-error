/* eslint-env jest */

const getConfig = require('../index');

function mockContext(getContent) {
  return {
    repo(params) {
      return Object.assign({ owner: 'owner', repo: 'repo' }, params);
    },

    github: {
      repos: {
        async getContent(params) {
          return { data: { content: global.btoa(getContent(params)) } };
        },
      },
      issues: {
        async create(params) {
          return params; // todo check octokit result
        },
      },
    },
  };
}

const yamlError = {
  name: 'YAMLException',
  reason: 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulatedempty line',
  mark: {
    name: null,
    buffer: 'welcome: [invalid]: yaml\n\u0000',
    position: 18,
    line: 0,
    column: 18,
  },
  message: 'incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line at line 1, column 19:\n    welcome: [invalid]: yaml\n                      ^',
};

function mockYamlError() {
  const err = yamlError;
  throw err;
}


test('throws on error', async () => {
  expect.assertions(2);
  const spy = jest.fn().mockImplementation(() => mockYamlError());
  try {
    await getConfig(mockContext(spy), 'test.yml');
  } catch (e) {
    console.log(e); // eslint-disable-line
    expect(spy).toHaveBeenCalledTimes(1);
    expect(e.name).toEqual('YAMLException');
  }
});

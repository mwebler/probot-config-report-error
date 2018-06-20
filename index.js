const probotGetConfig = require('probot-config');

/**
 * A wrapper around probot-config with additional error reporting
 * Loads the specified config file from the context's repository
 * and validate it against the provided schema
 *
 * @param {Context} context A Probot context
 * @param {string} fileName Name of the config file
 * @param {object} defaultConfig A default config that is merged in
 * @param {Joi=} schema A schema to validate the configuration
 * @returns {object} The merged configuration
 * @async
 */
async function getConfig(context, fileName, defaultConfig, schema) {
  try {
    const config = await probotGetConfig(context, fileName, defaultConfig);

    // A schema was provided to validate the configuration
    if (typeof schema !== 'undefined' && schema !== null) {
      // todo: validate schema
    }

    return config;
  } catch (error) {
    // trigger issue creation
    await context.github.issues.create({ owner: 'mymodule', repository: 'a repo', title: 'test issue' });
    // Let the caller know that an error occurred
    throw error;
  }
}
module.exports = getConfig;

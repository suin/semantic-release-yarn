# @suin/semantic-release-yarn

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to publish a [npm](https://www.npmjs.com) package using yarn@berry.

| Step               | Description                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify the presence of the `NPM_TOKEN` environment variable and verify the authentication method is valid. |
| `prepare`          | Update the `package.json` version and [create](https://yarnpkg.com/cli/pack) the npm package tarball.      |
| `publish`          | [Publish the npm package](https://yarnpkg.com/cli/npm/publish) to the registry.                            |

## Install

```bash
$ yarn add @suin/semantic-release-yarn -D
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@suin/semantic-release-yarn"
  ]
}
```

## Configuration

### Npm registry authentication

The npm authentication configuration is **required** and can be set via [environment variables](#environment-variables).

The [token](https://docs.npmjs.com/getting-started/working_with_tokens) is supported.

**Notes**:

- Only the `auth-only` [level of npm two-factor authentication](https://docs.npmjs.com/getting-started/using-two-factor-authentication#levels-of-authentication) is supported, **semantic-release** will not work with the default `auth-and-writes` level.

### Environment variables

| Variable    | Description                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `NPM_TOKEN` | Npm token created via [npm token create](https://docs.npmjs.com/getting-started/working_with_tokens#how-to-create-new-tokens) |

### Options

[See `PluginConfig` type declaration](https://github.com/suin/semantic-release-yarn/blob/main/pluginConfig.ts).

### Npm configuration

The plugin uses the [`yarn@berry` CLI](https://yarnpkg.com/cli) which will read the configuration from [`.yarnrc.yml`](https://yarnpkg.com/configuration/yarnrc).

**Notes**:

- The plugin currently only supports the NPM registry `https://registry.npmjs.org`.
- The plugin require yarn [version](https://github.com/yarnpkg/berry/blob/HEAD/packages/plugin-version/README.md) plugin. You don't have to install it manually, the plugin will install it for you.

### Examples

The `npmPublish` and `tarballDir` option can be used to skip the publishing to the `npm` registry and instead, release the package tarball with another plugin. For example with the [@semantic-release/github](https://github.com/semantic-release/github) plugin:

```json
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@suin/semantic-release-yarn",
      {
        "npmPublish": false,
        "tarballDir": "dist"
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": "dist/*.tgz"
      }
    ]
  ]
}
```

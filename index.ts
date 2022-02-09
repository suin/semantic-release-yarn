import SemanticReleaseError from "@semantic-release/error";
import readPackage from "read-pkg";
import semver from "semver";
import { PluginConfig } from "./pluginConfig.js";
import { Yarn } from "./yarn.js";

let verified = false;
let prepared = false;
const yarn = new Yarn();

export type { PluginConfig };

export async function verifyConditions(
  config: PluginConfig | undefined = undefined,
  context: Context
): Promise<void> {
  config = PluginConfig.normalize(config);
  context.logger.log(`read ${context.cwd}/package.json`);
  const pkg = await getPackage(context.cwd);
  if (pkg.private === true) {
    context.logger.log("skipping to verify npm auth since package is private");
    return;
  }
  if (config.npmPublish === false) {
    context.logger.log("skipping to verify npm auth since npmPublish is false");
    return;
  }
  context.logger.log('set npmRegistryServer: "https://registry.npmjs.org"');
  await yarn.setNpmRegistryServer("https://registry.npmjs.org");
  context.logger.log("set NPM_TOKEN to yarn config npmAuthToken");
  await yarn.setNpmAuthToken(getNpmToken(context.env));
  context.logger.log("verify npm auth");
  if (!(await yarn.authenticated())) {
    throw PluginError.EINVALIDNPMTOKEN();
  }
  context.logger.log("install version plugin");
  await yarn.pluginImportVersion();
  verified = true;
}

export async function prepare(
  config: PluginConfig | undefined = undefined,
  context: PrepareContext
) {
  config = PluginConfig.normalize(config);
  if (!verified) {
    return;
  }
  // Reload package.json in case a previous external step updated it
  context.logger.log(`read ${context.cwd}/package.json`);
  const pkg = await getPackage(context.cwd);
  if (pkg.private === true) {
    context.logger.log("skipping to prepare since package is private");
    return;
  }
  if (config.npmPublish === false) {
    context.logger.log("skipping to prepare since npmPublish is false");
    return;
  }
  context.logger.log(
    `rewrite the "version" field in the package.json: ${context.nextRelease.version}`
  );
  const tarballDir = config.tarballDir ?? ".";
  await yarn.version(context.nextRelease.version);
  if (typeof tarballDir === "string") {
    const tarballName = tarballDir + "/package.tgz";
    context.logger.log(`creating a tarball: ${tarballName}`);
    await yarn.pack(tarballName);
  }
  context.logger.log(`package contents:`);
  const tarballContents = await yarn.packDryRun();
  for (const tarballContent of tarballContents) {
    context.logger.log(`  ${tarballContent}`);
  }
  prepared = true;
}

export async function publish(
  config: PluginConfig | undefined = undefined,
  context: PrepareContext
) {
  config = PluginConfig.normalize(config);
  if (!verified || !prepared) {
    return;
  }
  // Reload package.json in case a previous external step updated it
  context.logger.log(`read ${context.cwd}/package.json`);
  const pkg = await getPackage(context.cwd);
  if (pkg.private === true) {
    context.logger.log("skipping to publish since package is private");
    return;
  }
  if (config.npmPublish === false) {
    context.logger.log("skipping to publish since npmPublish is false");
    return;
  }
  const { version } = context.nextRelease;
  const distTag = getChannel(context.nextRelease.channel);
  context.logger.log(
    `Publishing version ${version} to npm registry on dist-tag ${distTag}`
  );
  await yarn.publish(distTag);
  context.logger.log(
    `Published ${pkg.name}@${version} to dist-tag @${distTag}`
  );
}

interface Context {
  readonly cwd: string;
  readonly env: NodeJS.ProcessEnv;
  readonly stdout: NodeJS.WriteStream;
  readonly stderr: NodeJS.WriteStream;
  readonly logger: {
    readonly log: (message: string, ...vars: any[]) => void;
    readonly error: (message: string, ...vars: any[]) => void;
  };
}

interface PrepareContext extends Context {
  readonly nextRelease: {
    readonly version: string;
    readonly channel: string;
  };
}

class PluginError extends SemanticReleaseError {
  static ENOPKGNAME() {
    return new PluginError(
      "Missing `name` property in `package.json`.",
      "ENOPKGNAME"
    );
  }

  static ENOPKG() {
    return new PluginError("Missing `package.json`.", "ENOPKG");
  }

  static EINVALIDNPMTOKEN() {
    return new PluginError(
      "Invalid npm token.",
      "EINVALIDNPMTOKEN",
      `The npm token configured in the \`NPM_TOKEN\` environment variable must be a valid [token](https://docs.npmjs.com/getting-started/working_with_tokens) allowing to publish to the registry \`\`.

If you are using Two Factor Authentication for your account, set its level to ["Authorization only"](https://docs.npmjs.com/getting-started/using-two-factor-authentication#levels-of-authentication) in your account settings. **semantic-release** cannot publish with the default "
Authorization and writes" level.

Please make sure to set the \`NPM_TOKEN\` environment variable in your CI with the exact value of the npm token.`
    );
  }
}

async function getPackage(cwd: string) {
  let pkg;
  try {
    pkg = await readPackage({ cwd });
  } catch (error) {
    if ((error as any).code === "ENOENT") {
      throw PluginError.ENOPKG();
    }
    throw new AggregateError([error]);
  }
  if (!pkg.name) {
    throw PluginError.ENOPKGNAME();
  }
  return pkg;
}

function getNpmToken(env: NodeJS.ProcessEnv): string {
  if (typeof env["NPM_TOKEN"] !== "string") {
    throw PluginError.EINVALIDNPMTOKEN();
  }
  return env["NPM_TOKEN"];
}

const getChannel = (channel: string) =>
  channel
    ? semver.validRange(channel)
      ? `release-${channel}`
      : channel
    : "latest";

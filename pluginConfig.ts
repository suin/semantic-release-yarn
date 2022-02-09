export interface PluginConfig {
  /**
   * Whether to publish the npm package to the registry. If `false` the `package.json` version will still be updated.
   *
   * Default: `false` if the `package.json` [private](https://docs.npmjs.com/files/package.json#private) property is `true`, `true` otherwise.
   */
  readonly npmPublish?: boolean;

  /**
   *  Directory path in which to write the package tarball. If `false` the tarball is not be kept on the file system.
   *
   *  Default: `"."`
   */
  readonly tarballDir?: string | false;
}

export const PluginConfig = {
  normalize({
    npmPublish,
    tarballDir,
  }: PluginConfig | undefined = {}): PluginConfig {
    assertNullableBoolean(npmPublish, "npmPublish");
    assertNullableString(tarballDir, "tarballDir");
    return {
      npmPublish: npmPublish ?? true,
      tarballDir: tarballDir ?? ".",
    };
  },
};

function assertNullableBoolean(
  value: unknown,
  name: string
): asserts value is boolean | undefined {
  if (typeof value !== "undefined" || typeof value !== "boolean") {
    throw new Error(
      `${name} must be a boolean, but given ${JSON.stringify(value)}`
    );
  }
}

function assertNullableString(
  value: unknown,
  name: string
): asserts value is string | undefined {
  if (typeof value !== "undefined" || typeof value !== "string") {
    throw new Error(
      `${name} must be a string, but given ${JSON.stringify(value)}`
    );
  }
}

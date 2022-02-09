import execa from "execa";

export class Yarn {
  readonly #HOME?: string | undefined;
  readonly #YARN_RC_FILENAME?: string | undefined;
  readonly #cwd?: string | undefined;

  constructor({
    HOME,
    YARN_RC_FILENAME,
    cwd,
  }: {
    readonly HOME?: string;
    readonly YARN_RC_FILENAME?: string;
    readonly cwd?: string;
  } = {}) {
    this.#HOME = HOME;
    this.#YARN_RC_FILENAME = YARN_RC_FILENAME;
    this.#cwd = cwd;
  }

  async setNpmRegistryServer(registryServer: string): Promise<void> {
    await this.#exec("yarn", [
      "config",
      "set",
      "npmRegistryServer",
      registryServer,
      "--home",
    ]);
  }

  async getNpmRegistryServer(): Promise<string> {
    return JSON.parse(
      (
        await this.#exec("yarn", [
          "config",
          "get",
          "npmRegistryServer",
          "--json",
        ])
      ).stdout
    );
  }

  async setNpmAuthToken(npmAuthToken: string): Promise<void> {
    await this.#exec("yarn", [
      "config",
      "set",
      "npmAuthToken",
      npmAuthToken,
      "--home",
    ]);
  }

  async getNpmAuthToken(): Promise<string | null> {
    return JSON.parse(
      (
        await this.#exec("yarn", [
          "config",
          "get",
          "npmAuthToken",
          "--json",
          "--no-redacted",
        ])
      ).stdout
    );
  }

  async authenticated(): Promise<boolean> {
    try {
      await this.#exec("yarn", ["npm", "whoami"]);
      return true;
    } catch (e) {
      return false;
    }
  }

  async install(): Promise<void> {
    await this.#exec("yarn", ["install"]);
  }

  async pluginImportVersion(): Promise<void> {
    await this.#exec("yarn", ["plugin", "import", "version"]);
  }

  async version(version: string): Promise<void> {
    await this.#exec("yarn", ["version", version]);
  }

  async packDryRun(): Promise<ReadonlyArray<string>> {
    const jsonld = (await this.#exec("yarn", ["pack", "--dry-run", "--json"]))
      .stdout;
    return jsonld
      .split("\n")
      .map((line) => JSON.parse(line))
      .flatMap((line) => ("location" in line ? [line.location] : []))
      .sort();
  }

  async pack(filename: string = "package.tgz"): Promise<void> {
    await this.#exec("yarn", ["pack", "-o", filename]);
  }

  async publish(tag?: string): Promise<void> {
    await this.#exec("yarn", [
      "npm",
      "publish",
      ...(tag ? ["--tag", tag] : []),
    ]);
  }

  async #exec(file: string, args: string[]) {
    return execa(file, args, {
      ...(this.#cwd && { cwd: this.#cwd }),
      env: {
        HOME: this.#HOME,
        YARN_RC_FILENAME: this.#YARN_RC_FILENAME,
      },
    });
  }
}

import * as fs from "fs";
import tempy from "tempy";
import { describe, expect, test } from "vitest";
import { Yarn } from "./yarn.js";

const HOME = tempy.directory();
const YARN_RC_FILENAME = "yarnrc.test.yaml";
const yarn = new Yarn({ HOME, YARN_RC_FILENAME });

console.log(`yarn config path: ${HOME}/${YARN_RC_FILENAME}`);

test("setNpmRegistryServer", async () => {
  await yarn.setNpmRegistryServer("https://registry.npmjs.org");
  expect(await yarn.getNpmRegistryServer()).toBe("https://registry.npmjs.org");
});

test("setNpmAuthToken", async () => {
  const token = "__dummy_token__";
  await yarn.setNpmAuthToken(token);
  expect(await yarn.getNpmAuthToken()).toBe(token);
});

describe("authenticated", () => {
  test("with real NPM_TOKEN", async () => {
    const NPM_TOKEN = process.env["NPM_TOKEN"] as string;
    expect(NPM_TOKEN).toBeDefined();
    await yarn.setNpmAuthToken(NPM_TOKEN);
    expect(await yarn.authenticated()).toBe(true);
  });

  test("invalid NPM_TOKEN", async () => {
    await yarn.setNpmAuthToken("invalid");
    expect(await yarn.authenticated()).toBe(false);
  });
});

test.skip("version", async () => {
  const cwd = tempy.directory();
  const packageJson = `${cwd}/package.json`;
  fs.writeFileSync(
    packageJson,
    JSON.stringify({ version: "1.0.0", packageManager: "yarn@3.1.0" })
  );

  function getVersion() {
    return JSON.parse(fs.readFileSync(packageJson, "utf8")).version;
  }

  const yarn = new Yarn({ HOME, YARN_RC_FILENAME, cwd });
  await yarn.install();
  await yarn.pluginImportVersion();
  await yarn.version("1.0.1");
  expect(getVersion()).toBe("1.0.1");
});

test("yarnPackDryRun", async () => {
  const cwd = tempy.directory();
  const packageJson = `${cwd}/package.json`;
  fs.writeFileSync(
    packageJson,
    JSON.stringify({ version: "1.0.0", packageManager: "yarn@3.1.0" })
  );

  fs.mkdirSync(`${cwd}/lib`);
  fs.writeFileSync(`${cwd}/lib/index.js`, "");
  const yarn = new Yarn({ HOME, YARN_RC_FILENAME, cwd });
  const files = await yarn.packDryRun();
  expect(files).toMatchInlineSnapshot(`
      [
        "lib/index.js",
        "package.json",
      ]
    `);
});

test("yarnPack", async () => {
  const cwd = tempy.directory();
  const packageJson = `${cwd}/package.json`;
  fs.writeFileSync(
    packageJson,
    JSON.stringify({
      name: "mypkg",
      version: "1.0.0",
      packageManager: "yarn@3.1.0",
    })
  );
  const yarn = new Yarn({ HOME, YARN_RC_FILENAME, cwd });
  await yarn.pack("%s-%v.tgz");
  expect(fs.readdirSync(cwd)).contains("mypkg-1.0.0.tgz");
});

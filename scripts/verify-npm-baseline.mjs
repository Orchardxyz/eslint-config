import { execSync } from "node:child_process";

const version = execSync("npm --version", { encoding: "utf8" }).trim();
const [major, minor, patch] = version.split(".").map(Number);
const isSupported =
  major === 11 && (minor > 5 || (minor === 5 && patch >= 1));

if (!isSupported) {
  console.error(`npm ${version} is outside the supported 11.5.1 - <12 range.`);
  process.exit(1);
}

console.log(`Using npm ${version}`);

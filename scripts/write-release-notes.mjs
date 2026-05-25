import { readFile, writeFile } from "node:fs/promises";

const packageJson = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url), "utf8")
);
const changelog = await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const version = packageJson.version;

if (typeof version !== "string" || version.length === 0) {
  throw new Error("Unable to read a non-empty version from package.json.");
}

const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const releaseNotesPattern = new RegExp(
  `^##\\s+\\[?${escapedVersion}\\]?.*?\\n([\\s\\S]*?)(?=^##\\s|(?![\\s\\S]))`,
  "m"
);
const match = changelog.match(releaseNotesPattern);

if (!match) {
  throw new Error(`Unable to find release notes for ${version} in CHANGELOG.md.`);
}

const [, notes] = match;
const normalizedNotes = notes.trim();

if (!normalizedNotes) {
  throw new Error(`CHANGELOG.md entry for ${version} is empty.`);
}

await writeFile(new URL("../.release-notes.md", import.meta.url), normalizedNotes + "\n");
process.stdout.write(version);

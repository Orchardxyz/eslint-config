import { readFile, writeFile } from "node:fs/promises";

const changelog = await readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8");
const match = changelog.match(/^##\s+\[?([^\]\s]+)\]?.*?\n([\s\S]*?)(?=^##\s|$)/m);

if (!match) {
  throw new Error("Unable to find the latest release notes in CHANGELOG.md.");
}

const [, version, notes] = match;
const normalizedNotes = notes.trim();

if (!normalizedNotes) {
  throw new Error(`CHANGELOG.md entry for ${version} is empty.`);
}

await writeFile(new URL("../.release-notes.md", import.meta.url), normalizedNotes + "\n");
process.stdout.write(version);

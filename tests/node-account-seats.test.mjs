import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "src/lib/licenses/service.ts"), "utf8");

test("self-hosted node runtime can create accounts without a Paymug plan", () => {
	assert.match(src, /import\s*\{[^}]*isNodeRuntime[^}]*\}\s*from\s*"@\/lib\/runtime"/);
	assert.match(src, /const selfHosted = isNodeRuntime\(env\)/);
	assert.match(src, /canManageAccounts: status\.active \|\| selfHosted/);
	assert.match(src, /canShareMailboxes: status\.active && status\.plan === "team"/);
});

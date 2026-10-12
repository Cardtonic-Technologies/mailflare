import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const registerRoute = readFileSync(join(root, "src/app/api/auth/register/route.ts"), "utf8");
const registerClient = readFileSync(join(root, "src/app/(auth)/register/register-client.tsx"), "utf8");

test("self-hosted first-run signup keeps the existing MX and uses SES", () => {
	assert.match(registerRoute, /const nodeRuntime = isNodeRuntime\(env\)/);
	assert.match(registerRoute, /receivingProvider:\s*"ses"/);
	assert.match(registerRoute, /sendingProvider:\s*"ses"/);
	assert.match(registerRoute, /enableRouting:\s*false/);
	assert.match(registerRoute, /replaceMxRecords:\s*false/);
	assert.match(
		registerRoute,
		/if\s*\(\s*!nodeRuntime\s*\)\s*\{[\s\S]*ensureEmailRoutingRuleToWorker/,
		"the Worker route must run only on the Cloudflare runtime",
	);
});

test("the account step does not require replacing MX on the node runtime", () => {
	assert.match(registerClient, /const keepExistingMx = runtime === "node"/);
	assert.match(registerClient, /!keepExistingMx && \(mxChecking/);
	assert.match(registerClient, /\{runtime !== "node" && \(/);
});

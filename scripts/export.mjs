import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);
const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  cwd: fileURLToPath(new URL("../", import.meta.url)),
  env: { ...process.env, NEXT_STATIC_EXPORT: "true" },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);

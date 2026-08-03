import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // typedRoutes disabled: the flow relies heavily on runtime-built dynamic
  // paths (`/discovery/${sessionId}`, `/feed/${sessionId}?sort=...`, the
  // status -> route mapping in lib/session/route-for-status.ts) which don't
  // play well with statically-inferred route literals. Revisit once the
  // route set stabilizes.
  // Keep Turbopack's root independent from the shell working directory so
  // parent lockfiles cannot be mistaken for this single-repository app.
  turbopack: {
    root: projectRoot,
  },
};

export default nextConfig;

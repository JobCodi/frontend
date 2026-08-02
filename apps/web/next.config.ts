import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  // typedRoutes disabled: the flow relies heavily on runtime-built dynamic
  // paths (`/discovery/${sessionId}`, `/feed/${sessionId}?sort=...`, the
  // status -> route mapping in lib/session/route-for-status.ts) which don't
  // play well with statically-inferred route literals. Revisit once the
  // route set stabilizes.
  turbopack: {
    root: appRoot,
  },
};

export default nextConfig;

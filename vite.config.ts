// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "fs";
import path from "path";

// Simple helper to parse .env file in Node without ESM require cycle issues
function readEnvApiUrl() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      const match = content.match(/^VITE_API_URL\s*=\s*(.+)$/m);
      if (match) {
        return match[1].trim();
      }
    }
  } catch (err) {
    console.error("Failed to read .env file:", err);
  }
  return "http://localhost:4001";
}

const apiTarget = readEnvApiUrl();

export default defineConfig({
  vite: {
    server: {
      port: 5173,
      strictPort: true,
      allowedHosts: true,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true
        }
      }
    }
  }
});

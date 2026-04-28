import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "./test-results",
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
  use: {
    trace: "on-first-retry"
  },
  webServer: [
    {
      command: "pnpm --filter @bankng/web start",
      url: "http://localhost:3000",
      reuseExistingServer: true,
      stdout: "pipe",
      stderr: "pipe"
    },
    {
      command: "pnpm --filter @bankng/admin start",
      url: "http://localhost:3001",
      reuseExistingServer: true,
      stdout: "pipe",
      stderr: "pipe"
    },
    {
      command: "pnpm --filter @bankng/banker start",
      url: "http://localhost:3002",
      reuseExistingServer: true,
      stdout: "pipe",
      stderr: "pipe"
    },
    {
      command: "pnpm --filter @bankng/api start",
      url: "http://localhost:3003",
      reuseExistingServer: true,
      stdout: "pipe",
      stderr: "pipe"
    }
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});

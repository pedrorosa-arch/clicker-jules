const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './verification',
  use: {
    headless: true,
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'python3 -m http.server 8080',
    port: 8080,
    reuseExistingServer: true,
  },
});

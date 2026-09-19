import { defineConfig } from 'allure';

export default defineConfig({
  name: 'Toolshop BDD tests',
  output: './test-output/allure-report',
  plugins: {
    awesome: {
      options: {
        // One self-contained index.html that can be shared without a web server.
        singleFile: true,
        reportLanguage: 'en',
      },
    },
  },
});

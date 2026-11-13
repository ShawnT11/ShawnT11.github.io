# The AI Explainer workflow collection

Build with Node.js 20 or later: `node build-site.mjs`. Run meaningful data-tool checks with `node --test tests/*.test.mjs`. Preview with `node preview-server.mjs`.

Open index.html directly to use the completed site, including its browser tools. A local HTTP preview is optional.

The site is static and keeps the existing domain, publisher meta tag, and ads.txt. It adds ten workflow guides, four browser-local tools, 21 AI cases, thirteen CSV practice files plus authored text exercises and three Power Query M files, expected results, and one formula-driven XLSX. The tool application loads no advertising; the live hosting layer injects Cloudflare Web Analytics, disclosed on privacy.html. All practice data is fictional.

The builder runs build-legacy.mjs to retain the existing article URLs, then applies the shared navigation and new collection. Edit content/workflows.mjs for spreadsheet guides, content/ai-cases.mjs for the AI case library, content/power-query-guide.mjs for Power Query instructions, and build-site.mjs for page structure. The worked XLSX and its actual renders are committed static assets. Its authoring script uses the bundled artifact-tool runtime outside the deployable site.

The workbook formula engine was checked against independent calculations and representative input edits. Power Query M downloads passed Microsoft parser 5.0.0 syntax checks; native M execution was not completed. Follow the supplied self-test and local-file refresh steps in your Excel version. The XLSX has no embedded query. No live deployment or AdSense review is performed by this build.

For existing GitHub Pages hosting, publish the static files at repository root using the existing deployment process. Keep .git unchanged. No framework build or backend is required.

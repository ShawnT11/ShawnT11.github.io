# The AI Explainer workflow collection

Build with Node.js 20 or later: `node build-site.mjs`. Run meaningful data-tool checks with `node --test tests/*.test.mjs`. Preview with `node preview-server.mjs`.

Open index.html directly to use the completed site, including its browser tools. A local HTTP preview is optional.

The site is static and keeps the existing domain, publisher meta tag, and ads.txt. It adds ten workflow guides, four browser-local tools, eleven CSV practice files, expected results, and one formula-driven XLSX. Tool pages load no advertising or analytics. All practice data is fictional.

The builder runs build-legacy.mjs to retain the existing article URLs, then applies the shared navigation and new collection. Edit content/workflows.mjs for the new guides and build-site.mjs for page structure. The worked XLSX and its actual renders are committed static assets. Its authoring script uses the bundled artifact-tool runtime outside the deployable site.

The workbook formula engine was checked against independent calculations and representative input edits. Power Query instructions are documentation-based, and the XLSX has no embedded query. No live deployment or AdSense review is performed by this build.

For existing GitHub Pages hosting, publish the static files at repository root using the existing deployment process. Keep .git unchanged. No framework build or backend is required.

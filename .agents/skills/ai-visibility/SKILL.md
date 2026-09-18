---
name: ai-visibility
description: Review documentation PRs, pages, or navigation for visibility to AI consumers — crawlers building training corpora, RAG retrievers, and autonomous agents — across the model lifecycle (pre-training, training, post-training, inference/RAG). Use whenever the user asks how docs appear to LLMs or AI agents, asks to review a PR or page for AI visibility, discoverability, GEO, or agent experience, or mentions llms.txt, llms-full.txt, markdown twins, JSON-LD, canonical links, sitemap-md, or how a model would navigate a page.
---

# AI visibility

| Review target                          | Load                                                                 |
| -------------------------------------- | -------------------------------------------------------------------- |
| Frontmatter, canonical, and navigation | [references/discovery.md](references/discovery.md)                   |
| Markdown twins and corpora             | [references/markdown-artifacts.md](references/markdown-artifacts.md) |
| JSON-LD and agent retrieval            | [references/structured-data.md](references/structured-data.md)       |

Prerequisites: identify the published URL, source content, and generated
artifact path. Review the full route from crawl discovery through retrieval; do
not infer visibility from one tag. Distinguish current implementation evidence
from recommendations.

```sh
yarn build:md
yarn check:md-coherence
yarn check:jsonld-links
node scripts/check-jsonld-links.js --public-dir <dir>
node scripts/check-md-alternate-coherence.js --public-dir <dir>
```

Both check scripts accept `--public-dir`, so they run against a
`hugo --destination <dir>` build without `build:md`. Without the twins,
`check:md-coherence` fails for every page in the site; that is an environment
gap, not a regression.

Load the applicable reference only for its artifact class.

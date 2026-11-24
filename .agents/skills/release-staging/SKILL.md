---
name: release-staging
description: Review a staged documentation release or product launch as an independent reader. Use for combined docs-v2 PR candidates, GA and trial launches, release-readiness checks, or when shared content, contradictions, misleading links, and incomplete user journeys might escape source reviews. Navigate the rendered site with a browser, follow discoveries beyond changed Markdown, and report evidence-backed problems before publication.
---

# Review a staged documentation release

The goal is to find mistakes that a successful build, source search, and
file-by-file PR review miss. Evaluate whether the **combined rendered site**
tells a correct and coherent story for its intended readers.

Reuse the existing preview and evidence pipeline. [DAR #806](https://github.com/influxdata/DAR/issues/806)
owns the shared docs review and publication contract;
[docs-tooling #493](https://github.com/influxdata/docs-tooling/issues/493)
owns the execution/proof work. Extend their browser evaluator and report rather
than adding another preview, CI system, approval mechanism, or tracker.

## 1. Assemble the candidate

- Collect the relevant approved or proposed PRs for the specific launch or
  release. Record the target branch and exact head SHA for every PR.
- Compose changes on a **nonpublishing staging branch or disposable checkout**.
  Stop on conflicts. A staging merge is not a merge to `master`.
- Build and serve the complete Hugo site using the existing production-format
  preview infrastructure. Record the served revision, build settings, and URL.
- Provide the reviewer with the current product/release brief, approved facts,
  outstanding unknowns, and publication boundaries. Separate verified behavior
  from intended behavior. If the site or brief is unavailable, report the
  missing input instead of declaring the review clean.

Done when the reviewer can browse one assembled candidate tied to exact SHAs.

## 2. Explore the rendered UI as a reader

Start from the homepage and find the changed product using normal site
navigation. Follow the paths a real reader would use, such as choosing a product,
signing up, connecting, writing data, and querying. Use site search and related
links when relevant.

Inspect the browser-rendered text, menus, navigation, callouts, buttons, and
linked destinations. Follow suspicious or inconsistent claims into neighboring
pages, product editions, and shared documentation, even when no PR changed
their Markdown. Use desktop and mobile views where layout affects meaning.

Use the complete affected-page manifest, changed inputs, and product catalog
as **discovery leads**, not a closed list of permitted URLs. Follow evidence
until the contradiction is resolved or an explicit coverage limit is reached.
Record visited pages and meaningful unvisited areas. Do not equate a screenshot,
a build, or a string match with semantic verification.

## 3. Evaluate meaning and consistency

Look especially for:

- **Shared-content effects:** text reused in the wrong product, edition, or
  version; template or metadata changes altering pages outside the changed
  paths; mismatched navigation labels or links.
- **Contradictions:** a product is GA on one page and early access on another;
  conflicting region, authentication, API, CLI, support, or availability claims.
- **Broken user journeys:** steps assume an account, host, instance, token,
  permission, or feature that the reader has not yet obtained; confirmation is
  confused with readiness; links take readers into the wrong product.
- **Logical omissions:** a page says what to do but omits a prerequisite, a
  waiting state, a failure case, or the next actionable step.
- **Publication mistakes:** launch-only copy is exposed before authorization,
  or still-visible old access instructions contradict the published launch.

Distinguish an obsolete availability restriction from a real technical
limitation. Check factual claims against the launch brief and authoritative
product evidence, not merely against another docs page. Flag missing evidence
as uncertain rather than inventing a fact.

For example, in the InfluxDB 3 Cloud GA review, follow homepage -> product
overview -> signup -> confirmation -> provisioned instance -> first query.
An agent should notice a mismatch between a short confirmation delay and a
longer provisioning wait without being given the exact page or phrase to find.
Also follow the same product's links from shared decision pages and older
InfluxDB docs.

## 4. Report findings with reproduction evidence

Use the existing revision-specific PR evidence report. Each finding includes:

| Field | Content |
| --- | --- |
| Severity | Blocker, material, or advisory; state user impact |
| Location | Staged URL, visible text/control, and navigation path |
| Problem | What the reader sees and why it conflicts with the release brief or another page |
| Evidence | Compared URLs, exact short quotes, screenshot or browser trace, source of truth |
| Fix owner | Affected repository/PR or follow-up owner; unknown when not established |
| Confidence | Confirmed defect or needs product clarification |

Summarize the journeys actually followed, pages visited, areas not inspected,
and current PR SHAs. Separate deterministic test outcomes from the agent's
semantic assessment. Do not report `passed` when browser execution failed,
the agent was unavailable, or material evidence is unresolved.

Retain screenshots and traces under the existing 30-day evidence policy.

## 5. Integrate with release CI

The intended CI sequence is: **assemble candidate -> build and serve ->
independent browser agent review -> update the existing evidence report**.
Reuse the complete affected-page manifest and existing browser/proof workers
under DAR #806 and docs-tooling #493. A human or release coordinator supplies
the launch brief and selects the candidate; the agent explores autonomously.

Initially, run the same skill manually against a staging candidate as a
behavioral evaluation. Before enabling automated staging reviews, verify that
the CI runner can invoke a real browser-capable agent with no production
credentials and can attach current-SHA evidence to the existing report. CI
must show `not run` when that integration is unavailable.

Findings are advisory until the publication owner decides how to resolve them.
Staging success never authorizes production deployment, publication, or a
merge. After fixes, rerun against the revised candidate; the production release
gate remains the authoritative publication decision.

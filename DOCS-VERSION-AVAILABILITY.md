# Documenting version availability

How to state which product versions and editions a page or feature applies to.

This page covers the decisions: which marker to use, which surface carries
which fact, where a page lives, and when a notice is removed.
For field syntax, see [DOCS-FRONTMATTER.md](DOCS-FRONTMATTER.md).
For how Markdown twins and corpora are published, see
[DOCS-AI-VISIBILITY.md](DOCS-AI-VISIBILITY.md).

## Choose a marker

Match the marker to the scope of the version constraint.

| Scope                                                      | Use                                               | Example                                      |
| ---------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------- |
| The whole page applies to a version range                  | `metadata:` frontmatter                           | `metadata: [Explorer v1.9 and earlier]`      |
| The whole page is one of a generated set with a real range | `introduced`, `deprecated`, `removed` frontmatter | `introduced: "v1.9.0"`                       |
| One section applies to a version range                     | Heading attribute                                 | `## Configure user auth {metadata="v1.10+"}` |

Use `metadata:` when you need to state a ceiling or an exact phrase.
The `introduced`/`deprecated`/`removed` fields render as a range, such as
"InfluxDB 3 Explorer v1.0.0 – v1.10.0", which doesn't say which release is the
last working one.
Telegraf plugin pages use the range fields because the values are generated
from plugin metadata.

Don't state a version constraint only in body text.
Frontmatter markers render in a list under the page h1 and appear above the
lede in the page's Markdown twin, which is the text a retrieval system reads
first.

## Choose a surface

Each surface reaches a different audience.
Decide which one carries the fact before you write it.

| Surface                                           | Reaches                                                  | Use for                                                                 |
| ------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Frontmatter markers and the lede                  | Readers, search engines, Markdown twins, `llms-full.txt` | Any version or edition fact a reader or an agent needs to act correctly |
| `prepend` / `append` frontmatter (with `cascade`) | Same as above, on every page it cascades to              | A transition notice that must appear in the twin                        |
| `data/notifications.yaml`                         | Readers only                                             | A dated announcement, such as a release or a scheduled change           |

Notifications render in the site footer through
`layouts/partials/footer/notifications.html`, outside the article element.
They don't appear in Markdown twins or in `llms-full.txt`.
A fact that exists only in a notification is invisible to every AI consumer of
the docs, so don't use a notification as the only statement of a version
requirement.

Cascaded `prepend` content appears in the twin of every page it reaches, which
makes the first chunk of those pages similar to each other.
Keep cascaded notices to a few lines, and remove them when the transition ends.

## Place a feature page

When a feature spans two products, such as a UI feature that depends on a
server capability:

1. Put the canonical page in the product that owns the behavior.
2. Add `alt_links` so the product switcher moves readers to the equivalent page
   in the other product.
3. Add `related` entries from the other product's page.

Don't duplicate the instructions in both products.
If both products need the same body, use `source:` to share the content and set
`canonical: self` on the page whose URL marks the product identity.

## Include a version check

A page that documents a version-gated feature states how to verify the version,
or links to a page that does.
Give both a local check and a check that works against a running instance, so
that a reader without shell access to the server can still confirm the version.

Local:

```bash
influxdb3 --version
```

Running instance:

```sh
curl --get "http://localhost:8181/ping" \
  --header "Authorization: Bearer AUTH_TOKEN"
```

The `/ping` response includes the `x-influxdb-version` and `x-influxdb-build`
headers, and `version` and `revision` in the body.
Because `x-influxdb-build` reports `Core` or `Enterprise`, `/ping` is the only
check that answers both the version question and the edition question.
Use `GET`; a `HEAD` request returns `404`.

## Retire a notice

Every temporary notice names the release that removes it.

- For a `cascade.prepend` notice, record the removal release in the exec-plan
  for the change that added it.
- For a `data/notifications.yaml` entry, record the removal release with the
  entry `id`, so the entry can be found and deleted without reading the message
  text.

Version markers in frontmatter are permanent.
They describe a fact about the release, not a temporary state, so leave them in
place after the transition ends.

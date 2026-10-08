# Search operations (Algolia)

Operational decisions for the Algolia.com search index that powers site
search and autosuggest. This index is configured externally in the
Algolia dashboard/API, not in repository code. `assets/js/components/doc-search.js`
implements the query-side UI behavior only; it doesn't control index-level
settings like `attributeForDistinct` or `distinct`.

## Distinct setting: group results by page, not fragment

**Index settings:**

```json
{
  "attributeForDistinct": "url_without_anchor",
  "distinct": 2
}
```

**Why `url_without_anchor` is the grouping key:**
InfluxDB API reference pages generate one record per URL fragment
(one per endpoint/operation on the same page). Without distinct
grouping, a single page can dominate results, because Algolia ranks
each fragment record independently. `url_without_anchor` groups
records by the page URL, stripping the `#fragment`, so ranking treats
same-page fragments as one group instead of competing individually
for top slots.

**Why `distinct: 2`:**
Keeps up to 2 records per page group in results. This preserves
navigation to more than one relevant section per page (a single
endpoint might not be the only relevant match) while preventing a
single API reference page's fragment records from consuming all
autosuggest slots and crowding out other pages entirely.

**`url` remains the navigation target.** `url_without_anchor` is only
the distinct/grouping attribute; clicking a result still navigates to
the record's full `url`, fragment included.

## Why this setting exists

Autosuggest results for `templat` (partial query) returned hits from
several different pages, as expected. But results for `template`
(the complete word) returned only hits from the InfluxDB Cloud (TSM)
Templates API reference page, one hit per URL fragment on that page.
The complete-word match ranked every fragment on that page above
results from other, more relevant pages, because nothing grouped
same-page fragments together.

## Verification procedure

1. Open the site search / autosuggest UI.
2. Query `template`.
3. Confirm results include hits from more than one page (not just the
   Templates API reference page).
4. Confirm at most 2 hits from any single page (by `url_without_anchor`)
   appear in the result set.
5. Click a Templates API reference hit and confirm navigation lands on
   the correct URL, fragment included.
6. Repeat with `templat` (partial query) as a regression check; results
   should still span multiple pages as before.

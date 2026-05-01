# Client library release notes sync

Syncs `CHANGELOG.md` from the five InfluxDB v3 client library repos
(`InfluxCommunity/influxdb3-{python,go,js,csharp,java}`) into Hugo-flavored
release notes pages under `content/shared/`.

Driven by `.github/workflows/sync-client-library-release-notes.yml`
(nightly cron + manual dispatch).

## Local usage

```sh
# Sync one client (reads from a local checkout you provide).
node helper-scripts/client-libraries/sync-release-notes.js \
  --client python \
  --source-path /path/to/influxdb3-python

# Sync all five (expects --source-root with each repo checked out as a subdir).
node helper-scripts/client-libraries/sync-release-notes.js \
  --all \
  --source-root /path/to/InfluxCommunity
```

## Tests

```sh
node --test helper-scripts/client-libraries/test/transform-changelog.test.js
```

See [PLAN.md](../../PLAN.md) at the repo root for design context.

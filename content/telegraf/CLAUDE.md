# Telegraf Plugin Documentation - Edit in Source Repository

The Telegraf plugin documentation in subdirectories (`input-plugins/`, `output-plugins/`, `aggregator-plugins/`, `processor-plugins/`) is **generated from plugin READMEs** in the [influxdata/telegraf](https://github.com/influxdata/telegraf) repository.

## Workflow

1. **Source of truth**: Plugin READMEs in `telegraf/plugins/<type>/<plugin>/README.md`
2. **Automated sync**: The `telegraf-internal` repository generates documentation PRs from plugin READMEs
3. **Release process**: Telegraf releases automatically trigger documentation updates

## To Make Changes

1. Edit the source README in the `telegraf` repository: `plugins/<type>/<plugin>/README.md`
2. Submit a PR to `influxdata/telegraf`
3. After merge, the sync process will create a PR to docs-v2

## Plugin Types and Locations

| Directory | Source Location |
|-----------|-----------------|
| `input-plugins/` | `telegraf/plugins/inputs/<plugin>/README.md` |
| `output-plugins/` | `telegraf/plugins/outputs/<plugin>/README.md` |
| `aggregator-plugins/` | `telegraf/plugins/aggregators/<plugin>/README.md` |
| `processor-plugins/` | `telegraf/plugins/processors/<plugin>/README.md` |

## Documentation

- **Telegraf repository**: https://github.com/influxdata/telegraf
- **Contributing guide**: https://github.com/influxdata/telegraf/blob/master/CONTRIBUTING.md

## Non-Generated Content

The following files in `content/telegraf/` are **not generated** and can be edited directly:
- `_index.md`
- `configuration.md`
- `install.md`
- `get-started.md`
- `metrics.md`
- `release-notes.md`
- Other top-level documentation files

## Summary

Closes #

<!-- Brief description: What changed and why? -->

## Checklist

- [ ] Signed the [InfluxData CLA](https://www.influxdata.com/legal/cla/) ([if necessary](https://github.com/influxdata/docs-v2/blob/master/DOCS-CONTRIBUTING.md#sign-the-influxdata-cla))
- [ ] Rebased/mergeable
- [ ] Local build passes (`npx hugo --quiet`)

---

<details>
<summary><b>Suggested reviewers</b> (click to expand)</summary>

Based on files changed, consider requesting review from:

### InfluxDB 3

| Content | Engineering | Product |
|---------|-------------|---------|
| Core, Enterprise | @influxdata/monolith-team | @peterbarnett03, @garylfowler |
| Clustered | @influxdata/platform-team | @ritwika314, @sanderson |
| Cloud Dedicated | @influxdata/cloud-single-tenant | @ritwika314, @sanderson |
| Cloud Serverless | — | @mavarius, @garylfowler |
| Explorer | — | @mavarius, @peterbarnett03 |

### InfluxDB v2 / v1 / Enterprise v1

| Content | Engineering | Product |
|---------|-------------|---------|
| v2, Cloud (TSM) | @influxdata/edge | @sanderson, @jstirnaman |
| v1, Enterprise v1 | @influxdata/edge | @sanderson, @jstirnaman |

### Other Products

| Content | Engineering | Product |
|---------|-------------|---------|
| Telegraf | @influxdata/telegraf-team | @sanderson, @caterryan |
| Kapacitor | @influxdata/bonitoo | @sanderson, @jstirnaman |
| Chronograf | @influxdata/bonitoo | @mavarius, @caterryan |
| Flux | — | @sanderson, @jstirnaman |

### Shared / Cross-Product

| Content | Reviewers |
|---------|-----------|
| `/content/shared/` | @influxdata/product-managers |
| API docs | Relevant product team above |

</details>

<!--
Tips:
- Docs team (@influxdata/docs-team) is auto-assigned via CODEOWNERS
- Request additional reviewers above when ready for technical review
- Open as Draft until ready for review to avoid notification spam
- Copilot reviews automatically - address suggestions before requesting human review
-->

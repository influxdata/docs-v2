## InfluxDB v1 Release Documentation

**Release Version:** v1.x.x  
**Release Type:** [ ] OSS [ ] Enterprise [ ] Both

### Description
Brief description of the release and documentation changes.

### Release Documentation Checklist

#### Release Notes
- [ ] Generate release notes from changelog
  - [ ] OSS: Use commit messages from GitHub release tag `https://github.com/influxdata/influxdb/releases/tag/v1.x.x`
  - [ ] Enterprise: Use `https://dl.influxdata.com/enterprise/nightlies/master/CHANGELOG.md`
  - [ ] **Note**: For Enterprise releases, include important updates, features, and fixes from the corresponding OSS tag
- [ ] Update release notes in appropriate location
  - [ ] OSS: `/content/influxdb/v1/about_the_project/releasenotes-changelog.md`
  - [ ] Enterprise: `/content/enterprise_influxdb/v1/about-the-project/release-notes.md`
- [ ] Ensure release notes follow documentation formatting standards

#### Version Updates
- [ ] Update patch version in `/data/products.yml`
  - [ ] OSS: `influxdb > v1 > latest`
  - [ ] Enterprise: `enterprise_influxdb > v1 > latest`
- [ ] Update version references in documentation
  - [ ] Installation guides
  - [ ] Docker documentation
  - [ ] Download links
  - [ ] Code examples with version-specific commands

#### Content Verification
- [ ] Review breaking changes and update migration guides if needed
- [ ] Update compatibility matrices if applicable
- [ ] Verify all download links work correctly
- [ ] Check that version-specific features are documented

#### Testing
- [ ] Build documentation locally and verify changes render correctly
- [ ] Test all updated links
- [ ] Run link validation: `yarn test:links content/influxdb/v1/**/*.md`
- [ ] Run link validation: `yarn test:links content/enterprise_influxdb/v1/**/*.md`

### Related Resources
- DAR Issue: #
- OSS Release: https://github.com/influxdata/influxdb/releases/tag/v1.x.x
- Enterprise Changelog: https://dl.influxdata.com/enterprise/nightlies/master/CHANGELOG.md
- Slack Discussion: [Link to #releases thread]

### Post-Merge Actions
- [ ] Verify documentation is deployed to production
- [ ] Announce in #docs channel
- [ ] Close related DAR issue(s)

---
**Note:** For Enterprise releases, ensure you have access to the Enterprise changelog and coordinate with the release team for timing.
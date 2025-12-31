---
title: Manage Telegraf configurations
seotitle: Manage Telegraf configurations with Telegraf Controller
description: >
  Use Telegraf Controller to create, update, and delete Telegraf configurations.
menu:
  telegraf_controller:
    name: Manage configurations
weight: 3
---

Telegraf Controller provides a visual interface for managing Telegraf
configurations. Configurations define what metrics Telegraf collects, how it
processes those metrics, and where it sends the metrics.

## View configurations

Navigate to the **Configurations** section from the main navigation menu.
This displays a list of all existing configurations.

### List view

The **Configurations** page displays all configurations with:

- Search bar for filtering by name or description
- Label filters for organization
- Sort options

### Configuration details

On the **Configurations** page, click on a configuration name to view and
update the configuration.

{{< children hlevel="h2" >}}

## Best practices

### Organization
- Use descriptive names that indicate purpose
- Add detailed descriptions for complex configurations
- Apply consistent labeling schemes
- Group related configurations with labels

### Performance
- Set appropriate collection intervals based on metric importance
- Configure buffer sizes to handle peak loads
- Use filters to reduce unnecessary metric collection
- Test configurations before deployment

### Security
- Use secret stores for sensitive credentials
- Avoid hardcoding passwords in configurations
- Implement least-privilege access principles
- Regularly audit configuration access

### Maintenance
- Review and update configurations periodically
- Remove unused configurations
- Document configuration purposes and dependencies
- Test changes in development before production

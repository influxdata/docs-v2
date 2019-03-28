---
title: Use and manage variables
seotitle: Use and manage dashboard variables
description: >
  Dashboard variables allow you to alter specific components of cells' queries
  without having to edit the queries, making it easy to interact with your dashboard cells and explore your data.
menu:
  v2_0:
    parent: Visualize data
weight: 101
"v2.0/tags": [variables]
---

Dashboard variables allow you to alter specific components of cells' queries
without having to edit the queries, making it easy to interact with your dashboard cells and explore your data.

Variables are scoped by organization.

## Use dashboard variables
- Variables are stored in a `v` object associated with each dashboard.
  Variables are references using dot-notation (`v.variableName`).
- In the Cell Editor and Data explorer, available variables are listed in the variables tab.
  Must use the script builder. Click on a variable to input into your script.
  Hover over the variable in the variables tab to select a value for the current query.
  

## Predefined dashboard variables

##### v.timeRangeStart

##### v.timeRangeStop

##### v.windowPeriod

## Manage custom variables

{{< children >}}

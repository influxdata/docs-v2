---
title: Overview of notebooks
description: >
  Learn about the building blocks of a notebook. 
weight: 101
influxdb/cloud/tags:
menu:
  influxdb_cloud:
    name: Overview of notebooks
    parent: Notebooks
---

Learn the building blocks of a notebook. Each notebook has unlimited cells with different features to visualize, transform, and process your data.

## Preview and Run
The following options appear in the upper left of each notebook. 
 
### Preview
Preview presents your data output through cells without writing it to a bucket. Select Preview or press CTRL + Enter as a shortcut to preview data. 
 
### Run
Run presents your data output through cells and writes it to a bucket. Select Run in the dropdown list to write you data to a bucket.

## Notebook controls
The following options appear in the upper right of each notebook.

### Presentation mode
Presentation mode displays notebooks in full screen, hiding the left and top navigation menus so only the cells appear. This mode might be helpful, for example, for stationary screens dedicated to monitoring visualizations.

### Time range
Time ranges are customizable with a precision up to nanoseconds.

### Timezone
Timezones are selected in the dropdown list with local time (default) or UTC. 

## Cell types
Add one or more of the following cell types to your notebook:

- **Input: Metric Selector**:
Filter out your data using group keys.
- **Transform: Flux Script**:
Modify your data with Flux Script. `__PREVIOUS_RESULT__` refers to your previous inputs from the Metric Selector.
- **Transform: Downsample**:
Downsample data through aggregates.
- **Pass-through: Markdown**: 
Create explanatory notes or other information for yourself or one of your team members.
- **Pass-through: Visualization**:
Represents your data in visual formats such as graphs or charts. 
- **Output: Output to Bucket**: 
In **Preview** mode, this cell represents what would be written if the data was going to be committed to a bucket.

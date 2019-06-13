---
title: Single Stat visualization
list_title: Single stat
list_image: /img/2-0-visualizations-single-stat-example.png
description: >
  The Single Stat view displays the most recent value of the specified time series as a numerical value.
weight: 205
menu:
  v2_0:
    name: Single Stat
    parent: Visualization types
---

The **Single Stat** view displays the most recent value of the specified time series as a numerical value.

{{< img-hd src="/img/2-0-visualizations-single-stat-example.png" alt="Single stat example" />}}

To select this view, select the **Single Stat** option from the visualization dropdown in the upper right.

#### Single Stat Controls

To view **Single Stat** controls, click the settings icon ({{< icon "gear" >}})
next to the visualization dropdown in the upper right.

- **Prefix**: Prefix to be added to the single stat.
- **Suffix**: Suffix to be added to the single stat.
- **Decimal Places**: The number of decimal places to display for the single stat.
    - **Auto** or **Custom**: Enable or disable auto-setting.

###### Colorized Thresholds
- **Base Color**: Select a base or background color from the selection list.
- **Add a Threshold**: Change the color of the single stat based on the current value.
  - **Value is**: Enter the value at which the single stat should appear in the selected color.
    Choose a color from the dropdown menu next to the value.
- **Colorization**: Choose **Text** for the single stat to change color based on the configured thresholds.
  Choose **Background** for the background of the graph to change color based on the configured thresholds.

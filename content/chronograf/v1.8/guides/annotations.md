---
title: Use annotations in Chronograf views
description: >
  Add contextual information to Chronograf dashboards with annotations.
menu:
  chronograf_1_8:
    name: Use annotations
    weight: 50
    parent: Guides
---

## Use annotations in the Chronograf interface

Annotations in Chronograf are notes of explanation or comments added to graph views by editors or administrators. Annotations can provide Chronograf users with useful contextual information about single points in time or time intervals. Users can use annotations to correlate the effects of important events, such as system changes or outages across multiple metrics, with Chronograf data.

When an annotation is added, a solid white line appears on all graph views for that point in time or an interval of time.

### Annotations example

The following screenshot of five graph views displays annotations for a single point in time and a time interval.
The text and timestamp for the single point in time can be seem above the annotation line in the graph view on the lower right.
The annotation displays "`Deploy v3.8.1-2`" and the time "`2018/28/02 15:59:30:00`".

![Annotations on multiple graph views](/img/chronograf/1-6-annotations-example.png)


**To add an annotation using the Chronograf user interface:**

1. Click the **Edit** button ("pencil" icon) on the graph view.
2. Click **Add Annotation** to add an annotation.
3. Move cursor to point of time and click or drag cursor to set an annotation.
4. Click **Edit** again and then click **Edit Annotation**.
5. Click the cursor on the annotation point or interval. The annotation text box appears above the annotation point or interval.
6. Click on `Name Me` in the annotation and type a note or comment.
7. Click **Done Editing**.
8. Your annotation is now available in all graph views.

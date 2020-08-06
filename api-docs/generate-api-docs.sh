#!/bin/bash -e

# Get list of versions from directory names
versions="$(ls -d -- */)"

for version in $versions
do
  # Trim the trailing slash off the directory name
  version="${version%/}"
  menu="${version//./_}_ref"

  # Generate the frontmatter
  frontmatter="---
title: InfluxDB $version API documentation
description: >
  The InfluxDB API provides a programmatic interface for interactions with InfluxDB $version.
layout: api
menu:
  $menu:
    parent: InfluxDB v2 API
    name: View full API docs
weight: 102
---
"

  # Use Redoc to generate the API html
  redoc-cli bundle -t template.hbs \
    --title="InfluxDB $version API documentation" \
    --options.sortPropsAlphabetically \
    --options.menuToggle \
    --options.hideHostname \
    --templateOptions.version="$version" \
    $version/swagger.yml

  # Create temp file with frontmatter and Redoc html
  echo "$frontmatter" >> $version.tmp
  cat redoc-static.html >> $version.tmp

  # Remove redoc file and move the tmp file to it's proper place
  rm -f redoc-static.html
  mv $version.tmp ../content/influxdb/$version/api.html
done

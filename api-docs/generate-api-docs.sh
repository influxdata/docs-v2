#!/bin/bash -e

# Get list of versions from directory names
versions="$(ls -d -- */)"

for version in $versions
do
  # Trim the trailing slash off the directory name
  version="${version%/}"
  menu="influxdb_$(echo $version | sed 's/\./_/g;s/v//g;')_ref"
  if [ $version = "cloud" ]; then
    titleVersion="Cloud"
  else
    titleVersion="$version"
  fi

  # Generate the frontmatter
  v2frontmatter="---
title: InfluxDB $titleVersion API documentation
description: >
  The InfluxDB API provides a programmatic interface for interactions with InfluxDB $titleVersion.
layout: api
menu:
  $menu:
    parent: InfluxDB v2 API
    name: View v2 API docs
weight: 102
---
"
  v1frontmatter="---
title: InfluxDB $titleVersion v1 compatiblity API documentation
description: >
  The InfluxDB v1 compatility API provides a programmatic interface for interactions with InfluxDB $titleVersion using InfluxDB v1.x compatibly endpoints.
layout: api
menu:
  $menu:
    parent: 1.x compatibility
    name: View v1 compatibility API docs
weight: 304
---
"

  # Use Redoc to generate the v2 API html
  redoc-cli bundle -t template.hbs \
    --title="InfluxDB $titleVersion API documentation" \
    --options.sortPropsAlphabetically \
    --options.menuToggle \
    --options.hideHostname \
    --templateOptions.version="$version" \
    --templateOptions.titleVersion="$titleVersion" \
    $version/swagger.yml

  # Use Redoc to generate the v1 compatibility API html
  redoc-cli bundle -t template.hbs \
    --title="InfluxDB $titleVersion v1 compatibility API documentation" \
    --options.sortPropsAlphabetically \
    --options.menuToggle \
    --options.hideHostname \
    --templateOptions.version="$version" \
    --templateOptions.titleVersion="$titleVersion" \
    --output=redoc-static-v1-compat.html \
    $version/swaggerV1Compat.yml

  # Create temp file with frontmatter and Redoc html
  echo "$v2frontmatter" >> $version.tmp
  echo "$v1frontmatter" >> $version-v1-compat.tmp
  cat redoc-static.html >> $version.tmp
  cat redoc-static-v1-compat.html >> $version-v1-compat.tmp

  # Remove redoc file and move the tmp file to it's proper place
  rm -f redoc-static.html
  rm -f redoc-static-v1-compat.html
  mkdir -p ../content/influxdb/$version/api
  mv $version.tmp ../content/influxdb/$version/api/_index.html
  mv $version-v1-compat.tmp ../content/influxdb/$version/api/v1-compatibility.html
done

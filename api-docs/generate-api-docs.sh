#!/bin/bash -e

# Get list of versions from directory names
versions="$(ls -d -- */ | grep -v 'node_modules')"

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
    name: v2 API docs
weight: 102
---
"
  v1frontmatter="---
title: InfluxDB $titleVersion v1 compatibility API documentation
description: >
  The InfluxDB v1 compatibility API provides a programmatic interface for interactions with InfluxDB $titleVersion using InfluxDB v1.x compatibly endpoints.
layout: api
menu:
  $menu:
    parent: 1.x compatibility
    name: View v1 compatibility API docs
weight: 304
---
"

  # Use Redoc to generate the v2 API html
  npx redoc-cli bundle $version/swagger.yml \
    -t template.hbs \
    --title="InfluxDB $titleVersion API documentation" \
    --options.sortPropsAlphabetically \
    --options.menuToggle \
    --options.hideHostname \
    --templateOptions.version="$version" \
    --templateOptions.titleVersion="$titleVersion" \


  # Use Redoc to generate the v1 compatibility API html
  npx redoc-cli bundle $version/swaggerV1Compat.yml \
    -t template.hbs \
    --title="InfluxDB $titleVersion v1 compatibility API documentation" \
    --options.sortPropsAlphabetically \
    --options.menuToggle \
    --options.hideHostname \
    --templateOptions.version="$version" \
    --templateOptions.titleVersion="$titleVersion" \
    --output=redoc-static-v1-compat.html \


  # Create temp file with frontmatter and Redoc html
  echo "$v2frontmatter" >> $version.tmp
  echo "$v1frontmatter" >> $version-v1-compat.tmp

  V2LEN_INIT=$(wc -c $version.tmp | awk '{print $1}')
  V1LEN_INIT=$(wc -c $version-v1-compat.tmp | awk '{print $1}')

  cat redoc-static.html >> $version.tmp
  cat redoc-static-v1-compat.html >> $version-v1-compat.tmp

  V2LEN=$(wc -c $version.tmp | awk '{print $1}')
  V1LEN=$(wc -c $version-v1-compat.tmp | awk '{print $1}')

  if ! [[ $V2LEN -gt $V2LEN_INIT  ]]
   then
     echo "Error: bundle was not appended to $version.tmp"
     exit $?
  fi

  if ! [[ $V1LEN -gt $V1LEN_INIT  ]]
  then
    echo "Error: bundle was not appended to $version-v1-compat.tmp"
    exit $?
  fi

  # Remove redoc file and move the tmp file to it's proper place
  rm -f redoc-static.html
  rm -f redoc-static-v1-compat.html
  mkdir -p ../content/influxdb/$version/api
  mv $version.tmp ../content/influxdb/$version/api/_index.html
  mv $version-v1-compat.tmp ../content/influxdb/$version/api/v1-compatibility.html
done

#!/bin/bash

set -e

function buildHugoTemplate {
  version=$1
  apiVersion=$2
  module1=$3

  V_LEN_INIT=$(wc -c $version$module1.tmp | awk '{print $1}')
  cat "redoc-static${module1}.html" >> $version$module1.tmp
  V_LEN=$(wc -c $version$module1.tmp | awk '{print $1}')

  if ! [[ $V_LEN -gt $V_LEN_INIT  ]]
  then
    echo "Error: bundle was not appended to $version$module1.tmp"
    exit $?
  fi

  rm -f "redoc-static${module1}.html"
  mkdir -p ../content/influxdb/$version/api
}

function generateHtml {
  filePath=$1
  titleVersion=$2
  submodule=$3
  titleSubmodule=$4
 
  echo "Bundling $filePath"

  npx --version

  # Use npx to install and run the specified version of redoc-cli.
  # npm_config_yes=true npx overrides the prompt
  # and (vs. npx --yes) is compatible with npm@6 and npm@7.
  npm_config_yes=true npx redoc-cli@0.12.3 bundle $filePath \
    -t template.hbs \
    --title="InfluxDB $titleVersion$titleSubmodule API documentation" \
    --options.sortPropsAlphabetically \
    --options.menuToggle \
    --options.hideDownloadButton \
    --options.hideHostname \
    --options.noAutoAuth \
    --templateOptions.version="$version" \
    --templateOptions.titleVersion="$titleVersion" \
    --output="redoc-static$submodule.html"
}

# Get list of versions from directory names
versions="$(ls -d -- */ | grep -v 'node_modules' | grep -v 'openapi')"

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
  v1compatfrontmatter="---
title: InfluxDB $titleVersion v1 compatibility API documentation
description: >
  The InfluxDB v1 compatibility API provides a programmatic interface for interactions with InfluxDB $titleVersion using InfluxDB v1.x compatibility endpoints.
layout: api
menu:
  $menu:
    parent: 1.x compatibility
    name: View v1 compatibility API docs
weight: 304
---
"

  # If the v2 spec file differs from master, regenerate the HTML.
  filePath="${version}/ref.yml"
  fileChanged=$(git diff --name-status master -- ${filePath})
  if [ ! -z "$fileChanged" ]; then
    submodule=""
    titleSubmodule=""
    generateHtml $filePath $titleVersion $submodule $titleSubmodule

    # Create temp file with frontmatter and Redoc html
    echo "$v2frontmatter" >> $version.tmp
    buildHugoTemplate $version v2 $submodule && \
    mv $version.tmp ../content/influxdb/$version/api/_index.html
  fi

  # If the v1 compatibility spec file differs from master, regenerate the HTML.
  filePath="${version}/swaggerV1Compat.yml"
  fileChanged=$(git diff --name-status master -- ${filePath})
  if [ ! -z "$fileChanged" ]; then
    submodule="-v1-compat"
    titleSubmodule="v1 compatibility"
    generateHtml $filePath $titleVersion $submodule $titleSubmodule

    # Create temp file with frontmatter and Redoc html
    echo "$v1compatfrontmatter" >> $version$submodule.tmp
    buildHugoTemplate $version v1 $submodule && \
    mv $version$submodule.tmp ../content/influxdb/$version/api/v1-compatibility.html
  fi
done

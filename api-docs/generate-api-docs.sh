#!/bin/bash

set -e

function showHelp {
  echo "Usage: generate.sh <options>"
  echo "Commands:"
  echo "-c) Regenerate changed files. To save time in development, only regenerates files that differ from the master branch."
  echo "-h) Show this help message."
}

# Get arguments

generate_changed=1

while getopts "hc" opt; do
  case ${opt} in
    h)
      showHelp
      exit 0
      ;;
    c)
      generate_changed=0
      ;;
    \?)
      echo "Invalid option: $OPTARG" 1>&2
      showHelp
      exit 22
      ;;
    :)
      echo "Invalid option: $OPTARG requires an argument" 1>&2
      showHelp
      exit 22
      ;;
    esac
done

function generateHtml {
  specPath="$1"
  product="$2"
  productName="$3"
  api="$4"
  configPath="$5"
  isDefault=$6

  # Use the product name to define the menu for the Hugo template
  menu="influxdb_$(echo $product | sed 's/\./_/g;s/-/_/g;')"
  # Extract the API name--for example, "management" from "management@v2".
  apiName=$(echo $api | sed 's/@.*//g;')
  # Extract the API version--for example, "v0" from "management@v0".
  version=$(echo $api | sed 's/.*@//g;')
  # Use the title and summary defined in the product API's info.yml file.
  title=$(yq '.title' $product/$apiName/content/info.yml)
  menuTitle=$(yq '.x-influxdata-short-title' $product/$apiName/content/info.yml)
  description=$(yq '.summary' $product/$apiName/content/info.yml)
  # Define the file name for the Redoc HTML output.
  specbundle=redoc-static_index.html
  # Define the temporary file for the Hugo template and Redoc HTML.
  tmpfile="${product}-${api}_index.tmp"

  echo "Bundling $specPath"

  # Use npx to install and run the specified version of redoc-cli.
  # npm_config_yes=true npx overrides the prompt
  # and (vs. npx --yes) is compatible with npm@6 and npm@7.
  npx --version && \
  npm_config_yes=true npx redoc-cli@0.12.3 bundle $specPath \
  --config $configPath \
  -t template.hbs \
  --title=$title \
  --options.sortPropsAlphabetically \
  --options.menuToggle \
  --options.hideDownloadButton \
  --options.hideHostname \
  --options.noAutoAuth \
  --output=$specbundle \
  --templateOptions.description=$description \
  --templateOptions.product="$product" \
  --templateOptions.productName="$productName"

  if [[ $apiName == "v1-compatibility" ]]; then
    frontmatter="---
title: $title
description: $description
layout: api
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
weight: 304
aliases:
  - /influxdb/$product/api/v1/
---
"
  elif [[ $version == "0" ]]; then
  echo $productName $apiName
    frontmatter="---
title: $title
description: $description
layout: api
weight: 102
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
---
"
  elif [[ $isDefault == true ]]; then
    frontmatter="---
title: $title
description: $description
layout: api
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
weight: 102
aliases:
  - /influxdb/$product/api/
---
"
  else
    frontmatter="---
title: $title
description: $description
layout: api
menu:
  $menu:
    parent: InfluxDB HTTP API
    name: $menuTitle
    identifier: api-reference-$apiName
weight: 102
---
"
  fi

  # Create the Hugo template file with the frontmatter and Redoc HTML
  echo "$frontmatter" >> $tmpfile
  V_LEN_INIT=$(wc -c $tmpfile | awk '{print $1}')
  cat $specbundle >> $tmpfile
  V_LEN=$(wc -c $tmpfile | awk '{print $1}')

  if ! [[ $V_LEN -gt $V_LEN_INIT  ]]
  then
    echo "Error: bundle was not appended to $tmpfile"
    exit $?
  fi

  rm -f $specbundle
  # Create the directory and move the file.
  if [ ! -z "$apiName" ]; then
    mkdir -p ../content/influxdb/$product/api/$apiName
    mv $tmpfile ../content/influxdb/$product/api/$apiName/_index.html
  else
    mkdir -p ../content/influxdb/$product/api
    mv $tmpfile ../content/influxdb/$product/api/_index.html
  fi
}

# Use a combination of directory names and configuration files to build the API documentation.
# Each directory represents a product, and each product directory contains a configuration file that defines APIs and their spec file locations.
function build {
# Get the list of products from directory names
products="$(ls -d -- */ | grep -v 'node_modules' | grep -v 'openapi')"

for product in $products; do
  #Trim the trailing slash off the directory name
  product="${product%/}"
  # Get the product API configuration file.
  configPath="$product/.config.yml"
  if [ ! -f $configPath ]; then
    configPath=".config.yml"
  fi
  echo "Checking product config $configPath"
  # Get the product name from the configuration.
  productName=$(yq e '.x-influxdata-product-name' $configPath)
  if [[ -z "$productName" ]]; then
    productName=InfluxDB
  fi
  # Get an array of product API names (keys) from the configuration file
  apis=$(yq e '.apis | keys | .[]' $configPath)
  # Read each element of the apis array
  while IFS= read -r api; do
    # Get the spec file path from the configuration.
    specRootPath=$(yq e ".apis | .$api | .root" $configPath)
    # Check that the YAML spec file exists.
    specPath="$product/$specRootPath"
    echo "Checking for spec $specPath"
    if [ -d "$specPath" ] || [ ! -f "$specPath" ]; then
      echo "OpenAPI spec $specPath doesn't exist."
    fi
    # Get default status from the configuration.
    isDefault=false
    defaultStatus=$(yq e ".apis | .$api | .x-influxdata-default" $configPath)
    if [[ $defaultStatus == "true" ]]; then
      isDefault=true
    fi

    # If the spec file differs from master, regenerate the HTML.
    update=0
    if [[ $generate_changed == 0 ]]; then
      diff=$(git diff --name-status master -- ${specPath})
      if [[ -z "$diff" ]]; then
        update=1
      fi
    fi

    if [[ $update -eq 0 ]]; then
      echo "Regenerating $product $api"
      generateHtml "$specPath" "$product" "$productName" "$api" "$configPath" $isDefault
    fi
  done <<< "$apis"
done
}

build

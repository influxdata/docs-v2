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
  local specPath="$1"
  local productVersion="$2"
  local productName="$3"
  local api="$4"
  local configPath="$5"

  # Use the product name to define the menu for the Hugo template
  local menu="$(echo $productVersion | sed 's/\./_/g;s/-/_/g;s/\//_/g;')"
  # Short version name (for old aliases)
  # Everything after the last slash
  local versionDir=$(echo $productVersion | sed 's/.*\///g;')
  # Extract the API name--for example, "management" from "management@v2".
  local apiName=$(echo $api | sed 's/@.*//g;')
  # Extract the API version--for example, "v0" from "management@v0".
  local apiVersion=$(echo $api | sed 's/.*@//g;')
  # Use the title and summary defined in the product API's info.yml file.
  local title=$(yq '.title' $productVersion/$apiName/content/info.yml)
  local menuTitle=$(yq '.x-influxdata-short-title' $productVersion/$apiName/content/info.yml)
  # Get the shortened description to use for metadata.
  local shortDescription=$(yq '.x-influxdata-short-description' $productVersion/$apiName/content/info.yml)
  # Get the aliases array from the configuration file.
  local aliases=$(yq e ".apis | .$api | .x-influxdata-docs-aliases" "$configPath")
  # If aliases is null, set it to an empty YAML array. 
  if [[ "$aliases" == "null" ]]; then
    aliases='[]'
  fi
  local weight=102
  if [[ $apiName == "v1-compatibility" ]]; then
    weight=304
  fi
  # Define the file name for the Redoc HTML output.
  local specbundle=redoc-static_index.html
  # Define the temporary file for the Hugo template and Redoc HTML.
  local tmpfile="${productVersion}-${api}_index.tmp"
  
  echo "Bundling $specPath"

  # Use npx to install and run the specified version of redoc-cli.
  # npm_config_yes=true npx overrides the prompt
  # and (vs. npx --yes) is compatible with npm@6 and npm@7.
  npx --version && \
  npm_config_yes=true npx redoc-cli@0.12.3 bundle $specPath \
  --config $configPath \
  -t template.hbs \
  --title="$title" \
  --options.sortPropsAlphabetically \
  --options.menuToggle \
  --options.hideDownloadButton \
  --options.hideHostname \
  --options.noAutoAuth \
  --output=$specbundle \
  --templateOptions.description="$shortDescription" \
  --templateOptions.product="$productVersion" \
  --templateOptions.productName="$productName"

  local frontmatter=$(yq eval -n \
      ".title = \"$title\" |
       .description = \"$shortDescription\" |
       .layout = \"api\" |
       .weight = $weight |
       .menu.[\"$menu\"].parent = \"InfluxDB HTTP API\" |
       .menu.[\"$menu\"].name = \"$menuTitle\" |
       .menu.[\"$menu\"].identifier = \"api-reference-$apiName\" |
      .aliases = \"$aliases\"")

  frontmatter="---
$frontmatter
---
"

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
    mkdir -p ../content/$productVersion/api/$apiName
    mv $tmpfile ../content/$productVersion/api/$apiName/_index.html
  else
    mkdir -p ../content/$productVersion/api
    mv $tmpfile ../content/$productVersion/api/_index.html
  fi
}

# Use a combination of directory names and configuration files to build the API documentation.
# Each directory represents a product, and each product directory contains a configuration file that defines APIs and their spec file locations.
function build {
  local versions
  versions="$(ls -d -- */* | grep -v 'node_modules' | grep -v 'openapi')"
  for version in $versions; do
    # Trim the trailing slash off the directory name
    local version="${version%/}"
    # Get the version API configuration file.
    local configPath="$version/.config.yml"
    if [ ! -f "$configPath" ]; then
     # Skip to the next version if the configuration file doesn't exist.
      continue  
    fi
    echo "Using config $version $configPath"
    # Get the product name from the configuration.
    local versionName
    versionName=$(yq e '.x-influxdata-product-name' "$configPath")
    if [[ -z "$versionName" ]]; then
      versionName=InfluxDB
    fi
    # Get an array of API names (keys) from the configuration file
    local apis
    apis=$(yq e '.apis | keys | .[]' "$configPath")
    # Read each element of the apis array
    while IFS= read -r api; do
      echo "======Building $version $api======"
      # Get the spec file path from the configuration.
      local specRootPath
      specRootPath=$(yq e ".apis | .$api | .root" "$configPath")
      # Check that the YAML spec file exists.
      local specPath
      specPath="$version/$specRootPath"
      if [ -d "$specPath" ] || [ ! -f "$specPath" ]; then
        echo "OpenAPI spec $specPath doesn't exist."
      fi


      # If the spec file differs from master, regenerate the HTML.
      local update=0
      if [[ $generate_changed == 0 ]]; then
        local diff
        diff=$(git diff --name-status master -- "${specPath}")
        if [[ -z "$diff" ]]; then
          update=1
        fi
      fi

      if [[ $update -eq 0 ]]; then
        echo "Regenerating $version $api"
        generateHtml "$specPath" "$version" "$versionName" "$api" "$configPath"
      fi
      echo -e "========Finished $version $api========\n\n"
    done <<< "$apis"
  done
}

build

# Generate tag-based article data and content pages
echo "Generating OpenAPI article data..."
cd ..
node api-docs/scripts/dist/generate-openapi-articles.js
cd api-docs

#!/bin/bash

# Generate API reference documentation for all InfluxDB products.
#
# Pipeline:
#   1. post-process-specs.ts  — apply info/servers overlays + tag configs,
#      write resolved specs to _build/ (source specs are never mutated)
#   2. generateRedocHtml      — generate Redoc HTML from _build/ specs
#   3. generate-openapi-articles.js --static-only — copy _build/ specs to
#      static/openapi/ for download
#
# Specs must already be fetched and bundled (via getswagger.sh) before running.
#
# Usage:
#   sh generate-api-docs.sh       # Generate all products
#   sh generate-api-docs.sh -c    # Only regenerate specs that differ from master

set -e

function showHelp {
  echo "Usage: generate-api-docs.sh <options>"
  echo "Options:"
  echo "  -c  Regenerate only changed files (diff against master)"
  echo "  -h  Show this help message"
}

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

# ---------------------------------------------------------------------------
# Step 1: Post-process specs (info/servers overlays + tag configs)
# ---------------------------------------------------------------------------
# Writes resolved specs to api-docs/_build/. Source specs are never mutated.
# Runs from the repo root because post-process-specs reads .config.yml paths
# relative to the api-docs/ directory.

echo ""
echo "========================================"
echo "Step 1: Post-processing specs"
echo "========================================"
cd ..
node api-docs/scripts/dist/post-process-specs.js
cd api-docs

# ---------------------------------------------------------------------------
# Step 2: Generate Redoc HTML
# ---------------------------------------------------------------------------
# Iterates each product's .config.yml, generates Redoc HTML wrapped in Hugo
# frontmatter, and writes to content/{product}/api/_index.html.
# Reads resolved specs from _build/ (written by Step 1).

function generateRedocHtml {
  local specPath="$1"
  local productDir="$2"
  local productName="$3"
  local api="$4"
  local configPath="$5"

  local menu
  menu="$(echo "$productDir" | sed 's/\./_/g;s/-/_/g;s/\//_/g;')"

  local apiName
  apiName=$(echo "$api" | sed 's/@.*//g;')

  # Resolve info.yml from source (not _build/) for Hugo frontmatter metadata.
  local specDir
  specDir=$(dirname "$specPath")
  # Map _build/ path back to source for content file resolution.
  local sourceSpecDir="${specDir#_build/}"
  local sourceProductDir="${productDir}"
  local infoYml=""
  if [ -f "$sourceSpecDir/content/info.yml" ]; then
    infoYml="$sourceSpecDir/content/info.yml"
  elif [ -f "$sourceProductDir/content/info.yml" ]; then
    infoYml="$sourceProductDir/content/info.yml"
  fi

  local title
  title=$(yq '.title' "$infoYml")
  local menuTitle
  menuTitle=$(yq '.x-influxdata-short-title' "$infoYml")
  local shortDescription
  shortDescription=$(yq '.x-influxdata-short-description' "$infoYml")

  local aliases
  aliases=$(yq e ".apis | .$api | .x-influxdata-docs-aliases" "$configPath")
  if [[ "$aliases" == "null" ]]; then
    aliases='[]'
  fi

  local weight=102

  local specbundle=redoc-static_index.html
  local tmpfile="${productDir}-${api}_index.tmp"

  echo "Bundling $specPath"

  npx --version && \
  npm_config_yes=true npx redoc-cli@0.12.3 bundle "$specPath" \
    --config "$configPath" \
    -t template.hbs \
    --title="$title" \
    --options.sortPropsAlphabetically \
    --options.menuToggle \
    --options.hideHostname \
    --options.noAutoAuth \
    --options.hideDownloadButton \
    --output=$specbundle \
    --templateOptions.description="$shortDescription" \
    --templateOptions.product="$productDir" \
    --templateOptions.productName="$productName"

  local frontmatter
  frontmatter=$(yq eval -n \
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

  echo "$frontmatter" >> "$tmpfile"
  V_LEN_INIT=$(wc -c "$tmpfile" | awk '{print $1}')
  cat $specbundle >> "$tmpfile"
  V_LEN=$(wc -c "$tmpfile" | awk '{print $1}')

  if ! [[ $V_LEN -gt $V_LEN_INIT ]]; then
    echo "Error: bundle was not appended to $tmpfile"
    exit 1
  fi

  rm -f $specbundle

  if [ -n "$apiName" ]; then
    mkdir -p "../content/$productDir/api/$apiName"
    mv "$tmpfile" "../content/$productDir/api/$apiName/_index.html"
  else
    mkdir -p "../content/$productDir/api"
    mv "$tmpfile" "../content/$productDir/api/_index.html"
  fi
}

echo ""
echo "========================================"
echo "Step 2: Generating Redoc HTML"
echo "========================================"

# Iterate product directories that contain a .config.yml.
for configPath in $(find . -name '.config.yml' -not -path './.config.yml' -not -path '*/node_modules/*' -not -path '*/openapi/*' -not -path './_build/*'); do
  productDir=$(dirname "$configPath")
  # Strip leading ./
  productDir="${productDir#./}"
  configPath="${configPath#./}"

  echo "Using config $productDir $configPath"

  local_product_name=$(yq e '.x-influxdata-product-name' "$configPath")
  if [[ -z "$local_product_name" ]]; then
    local_product_name=InfluxDB
  fi

  apis=$(yq e '.apis | keys | .[]' "$configPath")

  while IFS= read -r api; do
    echo "======Building $productDir $api======"

    specRootPath=$(yq e ".apis | .$api | .root" "$configPath")
    # Read resolved spec from _build/ (written by Step 1)
    specPath="_build/$productDir/$specRootPath"

    if [ -d "$specPath" ] || [ ! -f "$specPath" ]; then
      echo "Resolved spec $specPath doesn't exist. Run Step 1 first. Skipping."
      continue
    fi

    # If -c flag set, only regenerate specs that differ from master.
    # Check the source spec (not _build/) for git diff.
    update=0
    if [[ $generate_changed == 0 ]]; then
      sourceSpecPath="$productDir/$specRootPath"
      diff_result=$(git diff --name-status master -- "${sourceSpecPath}" 2>/dev/null || true)
      if [[ -z "$diff_result" ]]; then
        update=1
      fi
    fi

    if [[ $update -eq 0 ]]; then
      echo "Regenerating $productDir $api"
      generateRedocHtml "$specPath" "$productDir" "$local_product_name" "$api" "$configPath"
    fi

    echo -e "========Finished $productDir $api========\n\n"
  done <<< "$apis"
done

# ---------------------------------------------------------------------------
# Step 3: Copy specs to static/openapi/ for download
# ---------------------------------------------------------------------------

echo ""
echo "========================================"
echo "Step 3: Copying specs to static/openapi/"
echo "========================================"
cd ..
node api-docs/scripts/dist/generate-openapi-articles.js --static-only
cd api-docs

echo ""
echo "========================================"
echo "Done"
echo "========================================"

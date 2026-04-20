#!/bin/bash -e

# Fetch and post-process InfluxData API specifications.
#
# Retrieves fully resolved OpenAPI (OAS) contract files from influxdata/openapi
# (or a custom base URL), then runs Redocly bundle with custom decorators.
#
# Syntax:
#   sh ./getswagger.sh <product>
#   sh ./getswagger.sh <product> -b <baseUrl>
#   sh ./getswagger.sh <product> -o <version> -b <baseUrl>
#   sh ./getswagger.sh <product> -o <version> -B
#
# Examples:
#   sh ./getswagger.sh cloud-serverless-v2
#   sh ./getswagger.sh clustered-v2 -B
#   sh ./getswagger.sh cloud-v2
#   sh ./getswagger.sh v2 -o v2.0 -b file:///Users/johnsmith/github/openapi

# Use openapi master branch as the default base URL.
baseUrl="https://raw.githubusercontent.com/influxdata/openapi/master"

# Use openapi docs-release/influxdb-oss branch for the OSS base URL.
baseUrlOSS="https://raw.githubusercontent.com/influxdata/openapi/docs-release/influxdb-oss"
ossVersion=""
verbose=""
product=""

function showHelp {
  cat <<'USAGE'
Usage: ./getswagger.sh <product> [options]

Products:
  cloud-v2                  InfluxDB Cloud v2
  cloud-dedicated-v2        InfluxDB Cloud Dedicated (data API)
  cloud-dedicated-management  InfluxDB Cloud Dedicated (management API)
  cloud-serverless-v2       InfluxDB Cloud Serverless (data API)
  clustered-v2              InfluxDB Clustered (data API)
  clustered-management      InfluxDB Clustered (management API)
  core-v3                   InfluxDB 3 Core
  enterprise-v3             InfluxDB 3 Enterprise
  v2                        InfluxDB OSS v2
  oss-v1                    InfluxDB OSS v1
  enterprise-v1             InfluxDB Enterprise v1
  all                       All products

Options:
  -b <URL>  Base URL to fetch from (default: influxdata/openapi master branch).
            ex. ./getswagger.sh cloud-v2 -b file:///Users/you/github/openapi
  -B        Use existing spec files — don't fetch.
  -o <ver>  OSS version to fetch (ex. v2.0).
  -V        Verbose mode.
  -h        Show this help.
USAGE
}

subcommand=$1

# Handle -h before product dispatch (product is normally the first arg)
if [[ "$subcommand" == "-h" ]]; then
  showHelp
  exit 0
fi

case "$subcommand" in
  cloud-dedicated-v2|cloud-dedicated-management|cloud-serverless-v2|\
  clustered-management|clustered-v2|cloud-v2|v2|\
  oss-v1|enterprise-v1|core-v3|enterprise-v3|all)
    product=$1
    shift

  while getopts ":o:b:BhV" opt; do
    case ${opt} in
      h)
        showHelp
        exit 0
        ;;
      V)
        verbose="-v"
        ;;
      B)
        baseUrl=""
        baseUrlOSS=""
        ;;
      b)
        baseUrl=$OPTARG
        baseUrlOSS=$OPTARG
        ;;
      o)
        ossVersion=$OPTARG
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
  shift $((OPTIND -1))
  ;;
esac

function showArgs {
  echo "product: $product"
  echo "baseUrl: $baseUrl"
  echo "ossVersion: $ossVersion"
}

# ---------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------

function postProcess() {
  local specPath="$1"
  local configPath="$2"
  local api="$3"

  local openapiCLI="@redocly/cli"
  local currentPath
  currentPath=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

  INFLUXDB_PRODUCT=$(dirname "$configPath") \
  INFLUXDB_API_NAME="${api%%@*}" \
  API_DOCS_ROOT_PATH="$currentPath" \
  npm_config_yes=true \
  npx "$openapiCLI" bundle "$specPath" \
    -o "$specPath" \
    --config="$configPath"
}

# Fetch a spec from a URL and run postProcess.
# Usage: fetchAndProcess <outFile> <sourceUrl> <configPath> <api>
function fetchAndProcess() {
  local outFile="$1" sourceUrl="$2" configPath="$3" api="$4"
  if [[ -z "$sourceUrl" ]]; then
    echo "Using existing $outFile"
  else
    # shellcheck disable=SC2086 # UPDATE_OPTIONS intentionally word-splits
    curl $UPDATE_OPTIONS "$sourceUrl" -o "$outFile"
  fi
  postProcess "$outFile" "$configPath" "$api"
}

# Clone influxdata/granite (cached across calls) and copy openapi.yaml.
# Usage: fetchManagementSpec <outFile>
_granite_dir=""
function fetchManagementSpec() {
  local outFile="$1"
  if [[ -z "$baseUrl" ]]; then
    echo "Using existing $outFile"
    return
  fi
  if [[ -z "$_granite_dir" ]]; then
    echo "Fetching latest openapi.yaml from influxdata/granite"
    _granite_dir=$(mktemp -d)
    git clone --depth 1 --branch main \
      https://github.com/influxdata/granite.git "$_granite_dir"
  fi
  cp "$_granite_dir/openapi.yaml" "$outFile"
}

# ---------------------------------------------------------------------------
# Build UPDATE_OPTIONS and optionally show args
# ---------------------------------------------------------------------------

UPDATE_OPTIONS="--fail"

if [[ -n "$verbose" ]]; then
  UPDATE_OPTIONS="-v $UPDATE_OPTIONS"
  showArgs
  echo ""
fi

# ---------------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------------

case "$product" in
  cloud-v2)
    fetchAndProcess \
      "influxdb/cloud/influxdb-cloud-v2-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb/cloud/.config.yml' 'v2@2'
    ;;
  cloud-dedicated-v2)
    fetchAndProcess \
      "influxdb3/cloud-dedicated/influxdb3-cloud-dedicated-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb3/cloud-dedicated/.config.yml' 'data@2'
    ;;
  cloud-dedicated-management)
    fetchManagementSpec \
      "influxdb3/cloud-dedicated/management/openapi.yml"
    ;;
  cloud-serverless-v2)
    fetchAndProcess \
      "influxdb3/cloud-serverless/influxdb3-cloud-serverless-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb3/cloud-serverless/.config.yml' 'data@2'
    ;;
  clustered-v2)
    fetchAndProcess \
      "influxdb3/clustered/influxdb3-clustered-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb3/clustered/.config.yml' 'data@2'
    ;;
  clustered-management)
    fetchManagementSpec \
      "influxdb3/clustered/management/openapi.yml"
    ;;
  core-v3)
    fetchAndProcess \
      "influxdb3/core/influxdb3-core-openapi.yaml" \
      "$baseUrl${baseUrl:+/TO_BE_DECIDED}" \
      'influxdb3/core/.config.yml' 'v3@3'
    ;;
  enterprise-v3)
    fetchAndProcess \
      "influxdb3/enterprise/influxdb3-enterprise-openapi.yaml" \
      "$baseUrl${baseUrl:+/TO_BE_DECIDED}" \
      'influxdb3/enterprise/.config.yml' 'v3@3'
    ;;
  v2)
    fetchAndProcess \
      "influxdb/v2/influxdb-oss-v2-openapi.yaml" \
      "$baseUrlOSS${baseUrlOSS:+/contracts/ref/oss.yml}" \
      'influxdb/v2/.config.yml' 'v2@2'
    ;;
  oss-v1)
    echo "Processing influxdb/v1/influxdb-oss-v1-openapi.yaml with decorators"
    postProcess \
      "influxdb/v1/influxdb-oss-v1-openapi.yaml" \
      'influxdb/v1/.config.yml' 'v1@1'
    ;;
  enterprise-v1)
    echo "Processing enterprise_influxdb/v1/influxdb-enterprise-v1-openapi.yaml with decorators"
    postProcess \
      "enterprise_influxdb/v1/influxdb-enterprise-v1-openapi.yaml" \
      'enterprise_influxdb/v1/.config.yml' 'v1@1'
    ;;
  all)
    fetchAndProcess \
      "influxdb/cloud/influxdb-cloud-v2-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb/cloud/.config.yml' 'v2@2'
    fetchAndProcess \
      "influxdb3/cloud-dedicated/influxdb3-cloud-dedicated-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb3/cloud-dedicated/.config.yml' 'data@2'
    fetchManagementSpec \
      "influxdb3/cloud-dedicated/management/openapi.yml"
    fetchAndProcess \
      "influxdb3/cloud-serverless/influxdb3-cloud-serverless-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb3/cloud-serverless/.config.yml' 'data@2'
    fetchAndProcess \
      "influxdb3/clustered/influxdb3-clustered-openapi.yaml" \
      "$baseUrl${baseUrl:+/contracts/ref/cloud.yml}" \
      'influxdb3/clustered/.config.yml' 'data@2'
    fetchManagementSpec \
      "influxdb3/clustered/management/openapi.yml"
    fetchAndProcess \
      "influxdb3/core/influxdb3-core-openapi.yaml" \
      "$baseUrl${baseUrl:+/TO_BE_DECIDED}" \
      'influxdb3/core/.config.yml' 'v3@3'
    fetchAndProcess \
      "influxdb3/enterprise/influxdb3-enterprise-openapi.yaml" \
      "$baseUrl${baseUrl:+/TO_BE_DECIDED}" \
      'influxdb3/enterprise/.config.yml' 'v3@3'
    fetchAndProcess \
      "influxdb/v2/influxdb-oss-v2-openapi.yaml" \
      "$baseUrlOSS${baseUrlOSS:+/contracts/ref/oss.yml}" \
      'influxdb/v2/.config.yml' 'v2@2'
    postProcess \
      "influxdb/v1/influxdb-oss-v1-openapi.yaml" \
      'influxdb/v1/.config.yml' 'v1@1'
    postProcess \
      "enterprise_influxdb/v1/influxdb-enterprise-v1-openapi.yaml" \
      'enterprise_influxdb/v1/.config.yml' 'v1@1'
    ;;
  "")
    showHelp
    exit 1
    ;;
  *)
    echo "Unknown product: $product"
    showHelp
    exit 22
    ;;
esac

# Clean up granite clone if created
if [[ -n "$_granite_dir" ]]; then
  rm -rf "$_granite_dir"
fi

#!/bin/bash -e

# Use this script to retrieve the following InfluxData API specifications:
# - the latest, fully resolved openapi (OAS, OpenAPI Specification) contract files from the influxdata/openapi repo
#
# Specify a product to retrieve (cloud-serverless, cloud-dedicated, clustered, cloud, v2, v1-compatibility, all).
# Optionally specify:
# - an OSS version as the second argument or using the -o flag.
#   The version specifies where to write the updated openapi.
#   The default version is the latest OSS version directory in the api-docs directory.
# - a base URL using the -b flag.
#   The baseURL specifies where to retrieve the openapi files from.
#   The default baseUrl (used for InfluxDB Cloud) is the master branch of influxdata/openapi.
#   The default baseUrl for OSS is the docs-release/influxdb-oss branch of influxdata/openapi.
#   For local development, pass your openapi directory using the file:/// protocol.
#   To use the existing ref.yml and prevent fetching any openapi files, use the -B flag.
# Syntax:
#   sh ./getswagger.sh <product>
#   sh ./getswagger.sh <product> -b <baseUrl>
#   sh ./getswagger.sh -c <product> -o <version> -b <baseUrl>
#   sh ./getswagger.sh -c <product> -o <version> -B
#
# Examples:
#   sh ./getswagger.sh cloud-serverless-v2
#   sh ./getswagger.sh clustered -B
#   sh ./getswagger.sh cloud-v2
#   sh ./getswagger.sh -c oss-v2 -b file:///Users/johnsmith/github/openapi

DOCS_ROOT=$(git rev-parse --show-toplevel)
API_DOCS_ROOT=$DOCS_ROOT/api-docs

versionDirs=($(ls -d */))
latestOSS=${versionDirs[${#versionDirs[@]}-1]}

# Use openapi master branch as the default base URL.
baseUrl="https://raw.githubusercontent.com/influxdata/openapi/master"

# Use openapi docs-release/influxdb-oss branch for the OSS base URL.
baseUrlOSS="https://raw.githubusercontent.com/influxdata/openapi/docs-release/influxdb-oss"
ossVersion=${latestOSS%/}
verbose=""
product=""

function showHelp {
  echo "Usage: ./getswagger.sh <product>"
  echo "    With optional arguments:"
  echo "       ./getswagger.sh <product> -b <baseUrl> -V"
  echo "       ./getswagger.sh cloud"
  echo "       ./getswagger.sh cloud-dedicated"
  echo "       ./getswagger.sh cloud-serverless"
  echo "       ./getswagger.sh v2 -V"
  echo "       ./getswagger.sh all"
  echo "Commands:"
  echo "-b <URL> The base URL to fetch from."
  echo "      ex. ./getswagger.sh -b file:///Users/yourname/github/openapi"
  echo "      The default is the influxdata/openapi repo master branch."
  echo "-B Use the existing ref.yml and prevent fetching any openapi files."
  echo "-h Show this help."
  echo "-o <semantic version> The OSS Version to fetch."
  echo "      ex. ./getswagger.sh oss -o v2.0"
  echo "      The default is the latest OSS version directory in the api-docs directory."
  echo "-V Verbose. Print the processed arguments and verbose Curl output."
}

subcommand=$1

case "$subcommand" in
  cloud-dedicated-v2|cloud-dedicated-v1-compatibility|cloud-dedicated-management|cloud-serverless-v2|cloud-serverless-v1-compatibility|clustered-v2|clustered-v1-compatibility|cloud-v2|cloud-v1-compatibility|v2-v2|v2-v1-compatibility|all|v1-compat)
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
  echo "product: $product";
  echo "baseUrl: $baseUrl";
}

function postProcess() {
  # Use npx to install and run the specified version of openapi-cli.
  # npm_config_yes=true npx overrides the prompt
  # and (vs. npx --yes) is compatible with npm@6 and npm@7.
  specPath="$1"
  # Replace the .yml extension in specPath with .json.
  specJsonPath="${specPath%.yml}.json"
  configPath="$2"
  api="$3"

  openapiCLI=" @redocly/cli"

  # TODO: Move some of this into the plugin:

  # Use Redoc's openapi-cli to regenerate the spec with custom decorations.
  # If you want to lint the source contract (before bundling),
  # pass `--lint` to the `bundle` command.
  # If you set environment variables (for example, INFLUXDB_PRODUCT=)
  # preceding the command name, you can then access the variables
  # in the NodeJS process.env global object.
#  INFLUXDB_API_VERSION=$apiVersion \
  npx --version
  INFLUXDB_PRODUCT=$(dirname "$configPath") \
  INFLUXDB_API_NAME=$(echo "$api" | sed 's/@.*//g;') \
  API_DOCS_ROOT_PATH=$API_DOCS_ROOT \
  npm_config_yes=true \
  npx $openapiCLI bundle $specPath \
    --config=$configPath \
    --ext yml \
    --output $specPath #\
  # TODO: Uncommend this after fixing the circular reference ($ref) issues in the specs.
  # && npx $openapiCLI bundle $specPath \
  #     --dereferenced \
  #     --ext json \
  #     --output $specJsonPath
}

function updateCloudV2 {
  outFile="$API_DOCS_ROOT/cloud/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/cloud/.config.yml" v2@2
}

function updateCloudDedicatedManagement {
  outFile="$API_DOCS_ROOT/cloud-dedicated/management/openapi.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS https://raw.githubusercontent.com/influxdata/granite/ab7ee2aceacfae7f415d15ffbcf8c9d0f6f3e015/openapi.yaml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/cloud-dedicated/.config.yml" management@0
}

function updateCloudDedicatedV2 {
  outFile="$API_DOCS_ROOT/cloud-dedicated/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
 postProcess $outFile "$API_DOCS_ROOT/cloud-dedicated/.config.yml" v2@2
}

function updateClusteredV2 {
  outFile="$API_DOCS_ROOT/clustered/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
 postProcess $outFile "$API_DOCS_ROOT/clustered/.config.yml" v2@2
}

function updateCloudServerlessV2 {
  outFile="$API_DOCS_ROOT/cloud-serverless/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/cloud-serverless/.config.yml" v2@2
}

function updateV2V2 {
  outFile="$API_DOCS_ROOT/v2/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/oss.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/v2/.config.yml" 'v2@2'
}

function updateCloudV1Compat {
  outFile="$API_DOCS_ROOT/cloud/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/cloud/.config.yml" 'v1-compatibility'
}

function updateCloudDedicatedV1Compat {
  outFile="$API_DOCS_ROOT/cloud-dedicated/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/cloud-dedicated/.config.yml" 'v1-compatibility'
}

function updateCloudServerlessV1Compat {
  outFile="$API_DOCS_ROOT/cloud-serverless/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/cloud-serverless/.config.yml" 'v1-compatibility'
}

function updateClusteredV1Compat {
  outFile="$API_DOCS_ROOT/clustered/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/clustered/.config.yml" 'v1-compatibility'
}

function updateV2V1Compatibility {
  outFile="$API_DOCS_ROOT/v2/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$API_DOCS_ROOT/v2/.config.yml" 'v1-compatibility'
}

function updateV1Compat { 
  updateCloudV1Compat
  updateCloudDedicatedV1Compat
  updateCloudServerlessV1Compat
  updateClusteredV1Compat
  updateV2V1Compatibility
}

UPDATE_OPTIONS="--fail"

if [ ! -z ${verbose} ];
then
  UPDATE_OPTIONS="-v $UPDATE_OPTIONS"
  showArgs
  echo ""
fi

if [ "$product" = "cloud-v2" ];
then
  updateCloudV2
elif [ "$product" = "cloud-dedicated-v2" ];
then
  updateCloudDedicatedV2
elif [ "$product" = "cloud-dedicated-management" ];
then
  updateCloudDedicatedManagement
elif [ "$product" = "cloud-serverless-v2" ];
then
  updateCloudServerlessV2
elif [ "$product" = "clustered-v2" ];
then
  updateClusteredV2
elif [ "$product" = "v2-v2" ];
then
  updateV2V2
elif [ "$product" = "cloud-dedicated-v1-compatibility" ];
then
  updateCloudDedicatedV1Compat
elif [ "$product" = "cloud-v1-compatibility" ];
then
  updateCloudV1Compat
elif [ "$product" = "cloud-serverless-v1-compatibility" ];
then
  updateCloudServerlessV1Compat
elif [ "$product" = "clustered-v1-compatibility" ];
then
  updateClusteredV1Compat
elif [ "$product" = "v2-v1-compatibility" ];
then
  updateV2V1Compatibility
elif [ "$product" = "v1-compat" ];
then
  updateV1Compat
elif [ "$product" = "all" ];
then
  updateCloudV2
  updateCloudDedicatedV2
  updateCloudDedicatedManagement
  updateCloudServerlessV2
  updateClusteredV2
  updateV2V2
  updateV1Compat
else
  echo "Provide a product argument: cloud-v2, cloud-serverless-v2, cloud-dedicated-v2, clustered-v2, v2-v2, v1-compat, or all."
  showHelp
fi

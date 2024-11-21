#!/bin/bash

# Determine the root directory of the Git repository
GIT_ROOT=$(git rev-parse --show-toplevel)

# Set SCRIPTS_ROOT to the api-build-scripts directory based on the Git root directory
SCRIPTS_ROOT="$GIT_ROOT/api-build-scripts"

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
  echo "      The default is the latest OSS version directory in the api-build-scripts directory."
  echo "-V Verbose. Print the processed arguments and verbose Curl output."
}

subcommand=$1

case "$subcommand" in
  cloud-dedicated-v2|cloud-dedicated-management|cloud-serverless-v2|clustered-v2|cloud-v2|v2|v1-compat|core-v3|enterprise-v3|all)
    product=$1
    shift
    ;;
  *)
    showHelp
    exit 1
    ;;
esac

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
      echo "Invalid option: -$OPTARG" 1>&2
      showHelp
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." 1>&2
      showHelp
      exit 1
      ;;
  esac
done

# Add your script logic here

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
  INFLUXDB_API_NAME=$(echo "$api" ,  sed 's/@.*//g;') \
  API_DOCS_ROOT_PATH=$SCRIPTS_ROOT \
  npm_config_yes=true \
  npx $openapiCLI bundle $specPath \
    --config=$configPath \
    --ext yml \
    --output $specPath #\
  # TODO: Uncomment this after fixing the circular reference ($ref) issues in the specs.
  # && npx $openapiCLI bundle $specPath \
  #     --dereferenced \
  #     --ext json \
  #     --output $specJsonPath
}

#TODO - Eliminate separate v1- and v2 files and use the same ref.yml files for all supported endpoints.
function updateCloudV2 {
  local version="$API_DOCS_ROOT/influxdb/cloud"
  local outFile="$version/v2/ref.yml"
  outFile="$API_DOCS_ROOT/cloud/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
  postProcess $outFile "$version/.config.yml" v2@2
}

function updateCloudDedicatedManagement {
  local version="$API_DOCS_ROOT/influxdb3/cloud-dedicated"
  local outFile="$version/management/openapi.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS https://raw.githubusercontent.com/influxdata/granite/ab7ee2aceacfae7f415d15ffbcf8c9d0f6f3e015/openapi.yaml -o $outFile
  fi
  postProcess $outFile "$version/.config.yml" management@0
}

function updateCloudDedicatedV2 {
  local version="$API_DOCS_ROOT/influxdb3/cloud-dedicated"
  local outFile="$version/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
 postProcess $outFile "$version/.config.yml" v2@2
}

function updateClusteredV2 {
  local version="$API_DOCS_ROOT/influxdb3/clustered"
  local outFile="$version/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
 postProcess $outFile "$version/.config.yml" v2@2
}

function updateCloudServerlessV2 {
  local version="$API_DOCS_ROOT/influxdb3/cloud-serverless"
  local outFile="$version/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
  postProcess $outFile "$version/.config.yml" v2@2
}

function updateCoreV3 {
  local version="$API_DOCS_ROOT/influxdb3/core"
  local outFile="$version/v3/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
    local url="${baseUrl}/TO_BE_DECIDED"
    curl $UPDATE_OPTIONS $url -o $outFile
  fi
  postProcess $outFile "$version/.config.yml" v3@3
}

function updateEnterpriseV3 {
  local version="$API_DOCS_ROOT/influxdb3/enterprise"
  local outFile="$version/v3/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
    local url="${baseUrl}/TO_BE_DECIDED"
    curl $UPDATE_OPTIONS $url -o $outFile
  fi
  postProcess $outFile "$version/.config.yml" v3@3
}

function updateOSSV2 {
  local version="$API_DOCS_ROOT/influxdb/v2"
  local outFile="$version/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/oss.yml -o $outFile
  fi
  postProcess $outFile "$version/.config.yml" '@2'
}

#TODO - Eliminate separate v1- and v2 files and use the same ref.yml files for all supported endpoints.
function updateV1Compat { 
  local product="$API_DOCS_ROOT/influxdb"
  local outFile="$product/cloud/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$product/cloud/.config.yml" 'v1-compatibility'

  outFile="$product/v2/v1-compatibility/swaggerV1Compat.yml"
  cp cloud/v1-compatibility/swaggerV1Compat.yml $outFile
  postProcess $outFile "$product/v2/.config.yml" 'v1-compatibility'

  product="$API_DOCS_ROOT/influxdb3"
  outFile="$product/cloud-dedicated/v1-compatibility/swaggerV1Compat.yml"
  postProcess $outFile "$product/cloud-dedicated/.config.yml" 'v1-compatibility'

  outFile="$product/cloud-serverless/v1-compatibility/swaggerV1Compat.yml"
  postProcess $outFile "$product/cloud-serverless/.config.yml" 'v1-compatibility'

  outFile="$product/clustered/v1-compatibility/swaggerV1Compat.yml"
  postProcess $outFile "$product/clustered/.config.yml" 'v1-compatibility'
}

function updateV2V1Compatibility {
  outFile="$API_DOCS_ROOT/v2/v1-compatibility/swaggerV1Compat.yml"
  cp cloud/v1-compatibility/swaggerV1Compat.yml $outFile
  postProcess $outFile "$API_DOCS_ROOT/v2/.config.yml" 'v1-compatibility'

  outFile="$API_DOCS_ROOT/cloud-dedicated/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$SCRIPTS_ROOT/cloud-dedicated/.config.yml" 'v1-compatibility'
}

function updateCloudServerlessV1Compat {
  outFile="$SCRIPTS_ROOT/cloud-serverless/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$SCRIPTS_ROOT/cloud-serverless/.config.yml" 'v1-compatibility'
}

function updateClusteredV1Compat {
  outFile="$SCRIPTS_ROOT/clustered/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$SCRIPTS_ROOT/clustered/.config.yml" 'v1-compatibility'
}

function updateV2V1Compatibility {
  outFile="$SCRIPTS_ROOT/v2/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "No URL was provided. I'll rebuild from the existing spec $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile "$SCRIPTS_ROOT/v2/.config.yml" 'v1-compatibility'
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
elif [ "$product" = "core-v3" ];
then
  updateCoreV3
elif [ "$product" = "enterprise-v3" ];
then
  updateEnterpriseV3
elif [ "$product" = "v2" ];
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
  updateCoreV3
  updateEnterpriseV3
  updateOSSV2
  updateV1Compat
else
  echo "Provide a product argument: cloud-v2, cloud-serverless-v2, cloud-dedicated-v2, cloud-dedicated-management, clustered-v2, core-v3, enterprise-v3, v2, v1-compat, or all."
  showHelp
fi

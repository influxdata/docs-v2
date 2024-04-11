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
#   sh ./getswagger.sh cloud-serverless
#   sh ./getswagger.sh clustered -B
#   sh ./getswagger.sh cloud
#   sh ./getswagger.sh -c v2 -o v2.0 -b file:///Users/johnsmith/github/openapi

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
  echo "       ./getswagger.sh oss -o <ossVersion> -V"
  echo "       ./getswagger.sh all -o <ossVersion>"
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
  cloud-dedicated-v2|cloud-dedicated-management|cloud-serverless-v2|clustered-v2|cloud-v2|v2|v1-compat|all)
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
  echo "product: $product";
  echo "baseUrl: $baseUrl";
  echo "ossVersion: $ossVersion";
}

function postProcess() {
  # Use npx to install and run the specified version of openapi-cli.
  # npm_config_yes=true npx overrides the prompt
  # and (vs. npx --yes) is compatible with npm@6 and npm@7.
  specPath="$1"
  configPath="$2"
  api="$3"

  openapiCLI=" @redocly/cli"
  currentPath=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

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
  API_DOCS_ROOT_PATH=$currentPath \
  npm_config_yes=true \
  npx $openapiCLI bundle $specPath \
    -o $specPath \
    --config=$configPath
}

 function updateCloudV2 {
  outFile="cloud/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
  postProcess $outFile 'cloud/.config.yml' v2@2
}

function updateCloudDedicatedManagement {
  outFile="cloud-dedicated/management/openapi.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
    curl $UPDATE_OPTIONS https://raw.githubusercontent.com/influxdata/granite/3117fb47d5e56afaadcebc226ff4b25785d95b5a/openapi.yaml -o $outFile
  fi
  postProcess $outFile 'cloud-dedicated/.config.yml' management@0
}

function updateCloudDedicatedV2 {
  outFile="cloud-dedicated/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
 postProcess $outFile 'cloud-dedicated/.config.yml' v2@2
}

function updateClusteredV2 {
  outFile="clustered/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
 postProcess $outFile 'clustered/.config.yml' v2@2
}

function updateCloudServerlessV2 {
  outFile="cloud-serverless/v2/ref.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  fi
  postProcess $outFile 'cloud-serverless/.config.yml' v2@2
}

function updateOSSV2 {
  outFile="v2/ref.yml"
  if [[ -z "$baseUrlOSS" ]];
  then
    echo "Using existing $outFile"
  else
    curl $UPDATE_OPTIONS ${baseUrlOSS}/contracts/ref/oss.yml -o $outFile
  fi
  postProcess $outFile 'v2/.config.yml' '@2'
}

function updateV1Compat {
  outFile="cloud/v1-compatibility/swaggerV1Compat.yml"
  if [[ -z "$baseUrl" ]];
  then
    echo "Using existing $outFile"
  else
  curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  fi
  postProcess $outFile 'cloud/.config.yml' 'v1-compatibility'

  outFile="v2/v1-compatibility/swaggerV1Compat.yml"
  cp cloud/v1-compatibility/swaggerV1Compat.yml $outFile
  postProcess $outFile 'v2/.config.yml' 'v1-compatibility'

  outFile="cloud-dedicated/v1-compatibility/swaggerV1Compat.yml"
  postProcess $outFile 'cloud-dedicated/.config.yml' 'v1-compatibility'

  outFile="cloud-serverless/v1-compatibility/swaggerV1Compat.yml"
  postProcess $outFile 'cloud-serverless/.config.yml' 'v1-compatibility'

  outFile="clustered/v1-compatibility/swaggerV1Compat.yml"
  postProcess $outFile 'clustered/.config.yml' 'v1-compatibility'
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
elif [ "$product" = "v2" ];
then
  updateOSSV2
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
  updateOSSV2
  updateV1Compat
else
  echo "Provide a product argument: cloud-v2, cloud-serverless-v2, cloud-dedicated-v2, clustered-v2, v2, v1-compat, or all."
  showHelp
fi

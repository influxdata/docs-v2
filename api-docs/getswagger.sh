#!/bin/bash -e

# This script provides a simple way grab the latest fully resolved openapi (OAS, OpenAPI Specification) contract files
# from the influxdata/openapi repo.
#
# Specify a platform to retrieve (cloud-iox, cloud, oss, v1compat, all).
# Optionally specify:
# - an OSS version as the second argument or using the -o flag.
#   The version specifies where to write the updated openapi.
#   The default version is the latest OSS version directory in the api-docs directory.
# - a base URL using the -b flag.
#   The baseURL specifies where to retrieve the openapi files from.
#   The default baseUrl (used for InfluxDB Cloud) is the master branch of influxdata/openapi.
#   The default baseUrl for OSS is the docs-release/influxdb-oss branch of influxdata/openapi.
#   For local development, pass your openapi directory using the file:/// protocol.
#
# Syntax:
#   sh ./getswagger.sh <platform>
#   sh ./getswagger.sh <platform> -b <baseUrl>
#   sh ./getswagger.sh -c <platform> -o <version> -b <baseUrl>
#
# Examples:
#   sh ./getswagger.sh cloud-iox
#   sh ./getswagger.sh cloud
#   sh ./getswagger.sh -c oss -o v2.0 -b file:///Users/johnsmith/github/openapi

versionDirs=($(ls -d */))
latestOSS=${versionDirs[${#versionDirs[@]}-1]}

# Use openapi master branch as the default base URL.
baseUrl="https://raw.githubusercontent.com/influxdata/openapi/master"

# Use openapi docs-release/influxdb-oss branch for the OSS base URL.
baseUrlOSS="https://raw.githubusercontent.com/influxdata/openapi/docs-release/influxdb-oss"
ossVersion=${latestOSS%/}
verbose=""
platform=""

function showHelp {
  echo "Usage: ./getswagger.sh <platform>"
  echo "    With optional arguments:"
  echo "       ./getswagger.sh <platform> -b <baseUrl> -V"
  echo "       ./getswagger.sh cloud"
  echo "       ./getswagger.sh oss -o <ossVersion> -V"
  echo "       ./getswagger.sh all -o <ossVersion>"
  echo "Commands:"
  echo "-b <URL> The base URL to fetch from."
  echo "      ex. ./getswagger.sh -b file:///Users/yourname/github/openapi"
  echo "      The default is the influxdata/openapi repo master branch."
  echo "-h Show this help."
  echo "-o <semantic version> The OSS Version to fetch."
  echo "      ex. ./getswagger.sh oss -o v2.0"
  echo "      The default is the latest OSS version directory in the api-docs directory."
  echo "-V Verbose. Print the processed arguments and verbose Curl output."
}

subcommand=$1

case "$subcommand" in
  cloud-iox|cloud|oss|v1compat|all)
    platform=$1
    shift

  while getopts ":o:b:hV" opt; do
    case ${opt} in
      h)
        showHelp
        exit 0
        ;;
      V)
        verbose="-v"
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
  echo "platform: $platform";
  echo "baseUrl: $baseUrl";
  echo "ossVersion: $ossVersion";
}

function postProcess() {
  # Use npx to install and run the specified version of openapi-cli.
  # npm_config_yes=true npx overrides the prompt
  # and (vs. npx --yes) is compatible with npm@6 and npm@7.
  specPath=$1
  platform="$2"
  apiVersion="$3"
  openapiCLI=" @redocly/cli"
  currentPath=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

  npx --version

  # Use Redoc's openapi-cli to regenerate the spec with custom decorations.
  # If you want to lint the source contract (before bundling),
  # pass `--lint` to the `bundle` command.
  # If you set environment variables (for example, INFLUXDB_PLATFORM=)
  # preceding the command name, you can then access the variables
  # in the NodeJS process.env global object.
  INFLUXDB_API_VERSION=$apiVersion \
  INFLUXDB_PLATFORM=$platform \
  API_DOCS_ROOT_PATH=$currentPath \
  npm_config_yes=true \
  npx $openapiCLI bundle $specPath \
    -o $specPath \
    --config=./.redocly.yaml
}

function updateCloud {
  outFile="cloud/ref.yml"
  curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  postProcess $outFile cloud
}

function updateCloudIOx {
  outFile="cloud-iox/ref.yml"
  curl $UPDATE_OPTIONS ${baseUrl}/contracts/ref/cloud.yml -o $outFile
  postProcess $outFile cloud-iox
}

function updateOSS {
  mkdir -p ${ossVersion}
  outFile="$ossVersion/ref.yml"
  curl $UPDATE_OPTIONS ${baseUrlOSS}/contracts/ref/oss.yml -o $outFile
  postProcess $outFile $ossVersion
}

function updateV1Compat {
  outFile="cloud/swaggerV1Compat.yml"
  curl $UPDATE_OPTIONS ${baseUrl}/contracts/swaggerV1Compat.yml -o $outFile
  postProcess $outFile cloud v1compat

  outFile="$ossVersion/swaggerV1Compat.yml"
  mkdir -p ${ossVersion} && cp cloud/swaggerV1Compat.yml $outFile
  postProcess $outFile $ossVersion v1compat
}

UPDATE_OPTIONS="--fail"

if [ ! -z ${verbose} ];
then
  UPDATE_OPTIONS="-v $UPDATE_OPTIONS"
  showArgs
  echo ""
fi

if [ "$platform" = "cloud" ];
then
  updateCloud
elif [ "$platform" = "cloud-iox" ];
then
  updateCloudIOx
elif [ "$platform" = "oss" ];
then
  updateOSS
elif [ "$platform" = "v1compat" ];
then
  updateV1Compat
elif [ "$platform" = "all" ];
then
  updateCloud
  updateCloudIOx
  updateOSS
  updateV1Compat
else
  echo "Provide a platform argument: cloud, cloud-iox, oss, v1compat, or all."
  showHelp
fi

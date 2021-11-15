#!/bin/bash -e

# This script provides a simple way grab the latest fully resolved openapi (OAS, OpenAPI Specification) contract files
# from the influxdata/openapi repo.
#
# Specify a context to retrieve (cloud, oss, v1compat, all).
# Optionally specify:
# - an OSS version as the second argument or using the -o flag.
#   The version specifies where to write the updated openapi.
#   The default version is the latest OSS version directory in the api-docs directory.
# - a base URL using the -b flag.
#   The baseURL specifies where to retrieve the openapi files from.
#   The default baseUrl is the master branch of the influxdata/openapi repo.
#   For local development, pass your openapi directory using the file:/// protocol.
#
# Syntax:
#   sh ./getswagger.sh <context>
#   sh ./getswagger.sh <context> -b <baseUrl>
#   sh .getswagger.sh -c <context> -o <version> -b <baseUrl>
#
# Examples:
#   sh ./getswagger.sh cloud
#   sh ./getswagger.sh -c oss -o v2.0 -b file:///Users/johnsmith/github/openapi

versionDirs=($(ls -d */))
latestOSS=${versionDirs[${#versionDirs[@]}-1]}
baseUrl="https://raw.githubusercontent.com/influxdata/openapi/master"
ossVersion=${latestOSS%/}
verbose=""
context=""

function showHelp {
  echo "Usage: ./getswagger.sh <context>"
  echo "    With optional arguments:"
  echo "       ./getswagger.sh <context> -b <baseUrl> -V"
  echo "       ./getswagger.sh oss -o <ossVersion> -V"
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
  cloud|oss|v1compat|all)
    context=$1
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
        ;;
      o)
        ossVersion=$OPTARG
        ;;
      \?)
        echo "Invalid option: $OPTARG" 1>&2
        showHelp
        ;;
      :)
        echo "Invalid option: $OPTARG requires an argument" 1>&2
        showHelp
        ;;
     esac
  done
  shift $((OPTIND -1))
  ;;
esac

function showArgs {
  echo "context: $context";
  echo "baseUrl: $baseUrl";
  echo "ossVersion: $ossVersion";
}

function updateCloud {
  echo "Updating Cloud openapi..."
  curl ${verbose} ${baseUrl}/contracts/ref/cloud.yml -s -o cloud/ref.yml
}

function updateOSS {
  echo "Updating OSS ${ossVersion} openapi..."
  mkdir -p ${ossVersion} && curl ${verbose} ${baseUrl}/contracts/ref/oss.yml -s -o $_/ref.yml
}

function updateV1Compat {
  echo "Updating Cloud and ${ossVersion} v1 compatibilty openapi..."
  curl ${verbose} ${baseUrl}/contracts/swaggerV1Compat.yml -s -o cloud/swaggerV1Compat.yml
  mkdir -p ${ossVersion} && cp cloud/swaggerV1Compat.yml $_/swaggerV1Compat.yml
}

if [ ! -z ${verbose} ];
then
  showArgs
  echo ""
fi

if [ "$context" = "cloud" ];
then
  updateCloud
elif [ "$context" = "oss" ];
then
  updateOSS
elif [ "$context" = "v1compat" ];
then
  updateV1Compat
elif [ "$context" = "all" ];
then
  updateCloud
  updateOSS
  updateV1Compat
else
  echo "Provide a context (cloud, oss, v1compat, all)"
  showHelp
fi

#!/bin/bash -e

# This script provides a simple way grab the latest fully resolved swagger files
# from the influxdata/openapi repo.
#
# Specify a context to retrieve (cloud, oss, v1compat, all).
# Optionally specify an OSS version to write the udpated swagger to.
# The default version is the latest OSS version directory in the api-docs directory
#
# Syntax:
#   sh ./getswagger.sh <context> <version>
#
# Examples:
#   sh ./getswagger.sh cloud
#   sh .getswagger.sh oss v2.0

versionDirs=($(ls -d */))
latestOSS=${versionDirs[${#versionDirs[@]}-1]}

context=$1
version=${2-${latestOSS%/}}

function updateCloud {
  echo "Updating Cloud swagger..."
  curl https://raw.githubusercontent.com/influxdata/openapi/master/contracts/cloud.yml -s -o cloud/swagger.yml
}

function updateOSS {
  echo "Updating OSS ${version} swagger..."
  curl https://raw.githubusercontent.com/influxdata/openapi/master/contracts/oss.yml -s -o ${version}/swagger.yml
}

function updateV1Compat {
  echo "Updating Cloud and ${version} v1 compatibilty swagger..."
  curl https://raw.githubusercontent.com/influxdata/openapi/master/contracts/swaggerV1Compat.yml -s -o cloud/swaggerV1Compat.yml
  cp cloud/swaggerV1Compat.yml ${version}/swaggerV1Compat.yml
}

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
fi
#! /bin/bash

# Path: test.sh
# Description:
# This script is used to copy content files for testing and to run tests on tests on those temporary copies.
# The temporary files are shared between the host and the Docker container
# using a bind mount configured in compose.yaml.
#
# Docker compose now has an experimental file watch feature
# (https://docs.docker.com/compose/file-watch/) that is likely preferable to the
# strategy here.
#
# Usage:
# The default behavior is to test all *.md files that have been added or modified in the current branch, effectively:
#
#  `git diff --name-only --diff-filter=AM --relative master | grep -E '\.md$' | ./test.sh`
#
# To specify files to test, in your terminal command line, pass a file pattern as the only argument to the script--for example:
#
#  sh test.sh ./content/**/*.md
##

paths="$1"
target=./test/tmp
testrun=./test/.test-run.txt
mkdir -p "$target"
cat /dev/null > "$testrun"
rm -rf "$target"/*

# Check if the user provided a path to copy.
if [ -z "$paths" ]; then
  echo "No path provided. Running tests for *.md files that have been added or modified in the current branch."
  paths=$(git diff --name-only --diff-filter=AM HEAD | \
    grep -E '\.md$')

  if [ -z "$paths" ]; then
    echo "No files found for pattern: $paths"
    exit 1
  fi
else
  paths=$(find "$paths" -type f -name '*.md')
fi

# Log the list of files to be tested and copy them to the test directory.
echo "$paths" >> "$testrun"
echo "$paths" | rsync -arv --files-from=- . "$target"

# Build or rebuild a service if the Dockerfile or build directory have changed, and then run the tests.
docker compose up test

# Troubleshoot tests
# If you want to examine files or run commands for debugging tests,
# start the container and use `exec` to open an interactive shell--for example:

# docker compose start test && docker compose exec -it test /bin/bash

# To build and run a new container and debug test failures, use `docker compose run` which runs a one-off command in a new container. Pass additional flags to be used by the container's entrypoint and the test runners it executes--for example:

# docker compose run --rm test -v
# docker compose run --rm test --entrypoint /bin/bash

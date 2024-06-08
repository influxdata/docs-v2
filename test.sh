#! /bin/zsh
set -o pipefail

# Path: test.sh
# Description:
# This script is used to copy content files for testing and to run tests on those temporary copies.
# The temporary files are shared between the host and the Docker container
# using a bind mount configured in compose.yaml.
#
# Note: Docker compose now has an experimental file watch feature
# (https://docs.docker.com/compose/file-watch/) that is likely preferable to the
# strategy here.
#
# Usage:
# The default behavior is to test staged *.md files that have been added or modified in the current branch.
#
# To specify files to test, in your terminal command line, pass a file pattern as the only argument to the script--for example:

# If the Dockerfile or entrypoint script has changed, rebuild the image
# before running tests--for example:
#
#  ```
#  docker compose build test
#  ````

TEST_SUBJECTS="$(pwd)"/tmp/test
rm -rf $TEST_SUBJECTS && mkdir -p $TEST_SUBJECTS 
cat /dev/null > ./test/test.log

# Arguments that follow the service name (test) are passed on to the test runner (currently pytest) via the entrypoint script specified in the Dockerfile.
git diff -z --diff-filter=d --name-only --staged -- **/*.md | \
    rsync -avz --log-file=./test/test.log --from0 --files-from=- . $TEST_SUBJECTS && \
    docker compose run -iT test bash -c \
        "pytest --codeblocks --envfile /test/.env.dedicated /app/src/content/influxdb/cloud-dedicated/ ;
        pytest --codeblocks --envfile /test/.env.serverless /app/src/content/influxdb/cloud-serverless/ ;
        pytest --codeblocks --envfile /test/.env.telegraf /app/src/content/telegraf/ ;
        pytest --codeblocks --envfile /test/.env.influxdbv2 /app/src/content/influxdb/v2/"
# if [ -d "$target/content/influxdb/cloud-dedicated/" ]; then
#     echo "Running cloud-dedicated tests..."
#     docker compose run --rm --env ./test/.env.dedicated test ./content/influxdb/cloud-dedicated/
# fi

# if [ -d "$target/content/influxdb/cloud-serverless/" ]; then
#     echo "Running cloud-serverless tests..."
#     docker compose run --rm --env ./test/.env.serverless test ./content/influxdb/cloud-serverless/ 
# fi

# if [ -d "$target/content/telegraf/" ]; then
#     echo "Running telegraf tests..."
#     docker compose run --rm --env ./test/.env.telegraf test ./content/telegraf/
# fi

# Troubleshoot tests
# If you want to examine files or run commands for debugging tests,
# start the container and use `exec` to open an interactive shell--for example:
#
# docker compose exec -it --entrypoint=/bin/bash test

# To build and run a new container and debug test failures, use `docker compose run` which runs a one-off command in a new container. Pass additional flags to be used by the container's entrypoint and the test runners it executes--for example:

# docker compose run --rm test -v
# docker compose run --rm test --entrypoint /bin/bash

# Or, pass the flags in the compose file--for example:
# services:
#   test:
#     build:...
#     command: ["-vv"]

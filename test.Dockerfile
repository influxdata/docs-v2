# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

# Starting from a Go base image is easier than setting up the Go environment later.
FROM golang:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
  curl \
  git \
  gpg \
  jq \
  maven \
  nodejs \
  npm \
  wget

# Install test runner dependencies
RUN apt-get install -y \
  python3 \
  python3-pip \
  python3-venv

RUN ln -s /usr/bin/python3 /usr/bin/python

# Create a virtual environment for Python to avoid conflicts with the system Python and having to use the --break-system-packages flag when installing packages with pip.
RUN python -m venv /opt/venv
# Enable venv
ENV PATH="/opt/venv/bin:$PATH"

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# RUN --mount=type=cache,target=/root/.cache/node_modules \
#     --mount=type=bind,source=package.json,target=package.json \
#     npm install

# Copy docs test directory to the image.
WORKDIR /usr/src/app
RUN chmod -R 755 .

ARG SOURCE_DIR

COPY data ./data
# Install parse_yaml.sh and parse YAML config files into dotenv files to be used by tests.
RUN /bin/bash -c 'curl -sO https://raw.githubusercontent.com/mrbaseman/parse_yaml/master/src/parse_yaml.sh'
RUN /bin/bash -c 'source ./parse_yaml.sh && parse_yaml ./data/products.yml > .env.products'

COPY test ./test
WORKDIR /usr/src/app/test
COPY shared/fixtures ./tmp/data

# Some Python test dependencies (pytest-dotenv and pytest-codeblocks) aren't
# available as packages in apt-cache, so use pip to download dependencies in a # separate step and use Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=test/requirements.txt,target=requirements.txt \
    pip install -Ur requirements.txt

COPY test/setup/run-tests.sh /usr/local/bin/run-tests.sh
RUN chmod +x /usr/local/bin/run-tests.sh

# Install Telegraf for use in tests.
# Follow the install instructions (https://docs.influxdata.com/telegraf/v1/install/?t=curl), except for sudo (which isn't available in Docker).
# influxdata-archive_compat.key GPG fingerprint:
#     9D53 9D90 D332 8DC7 D6C8 D3B9 D8FF 8E1F 7DF8 B07E
RUN wget -q https://repos.influxdata.com/influxdata-archive_compat.key

RUN echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null

RUN echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | tee /etc/apt/sources.list.d/influxdata.list

RUN apt-get update && apt-get install telegraf

# Install influx v2 Cloud CLI for use in tests.
# Follow the install instructions(https://portal.influxdata.com/downloads/), except for sudo (which isn't available in Docker).
# influxdata-archive_compat.key GPG fingerprint:
#     9D53 9D90 D332 8DC7 D6C8 D3B9 D8FF 8E1F 7DF8 B07E
RUN wget -q https://repos.influxdata.com/influxdata-archive_compat.key

RUN echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null

RUN echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | tee /etc/apt/sources.list.d/influxdata.list

RUN apt-get update && apt-get install influxdb2-cli

ENV TEMP_DIR=./tmp

ENTRYPOINT [ "run-tests.sh" ]
CMD [""]
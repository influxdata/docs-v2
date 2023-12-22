# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

# Starting from a Go base image is easier than setting up the Go environment later.
FROM golang:latest

RUN apt-get update && apt-get upgrade -y && apt-get install -y \
  curl \
  git \
  gpg \
  maven \
  nodejs \
  npm \
  wget

# Install test runner dependencies
RUN apt-get install -y \
  python3 \
  python3-pip \
   && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /usr/src/app

ARG SOURCE_DIR

COPY test ./test
COPY data ./test/data

RUN chmod -R 755 .

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app/test

COPY test/run-tests.sh /usr/local/bin/run-tests.sh
RUN chmod +x /usr/local/bin/run-tests.sh

# Some Python test dependencies (pytest-dotenv and pytest-codeblocks) aren't
# available as packages in apt-cache, so use pip to download dependencies in a # separate step and use Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=test/requirements.txt,target=./requirements.txt \
    python -m pip install --break-system-packages -r ./requirements.txt

# RUN --mount=type=cache,target=/root/.cache/node_modules \
#     --mount=type=bind,source=package.json,target=package.json \
#     npm install

# Install parse_yaml.sh and parse YAML config files into dotenv files to be used by tests.
RUN /bin/bash -c 'curl -sO https://raw.githubusercontent.com/mrbaseman/parse_yaml/master/src/parse_yaml.sh'
RUN /bin/bash -c 'source ./parse_yaml.sh && parse_yaml ./data/products.yml > .env.products'

# Install Telegraf for use in tests.
# Follow the install instructions (https://docs.influxdata.com/telegraf/v1/install/?t=curl), except for sudo (which isn't available in Docker).
# influxdata-archive_compat.key GPG Fingerprint: 9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E
RUN curl -s https://repos.influxdata.com/influxdata-archive.key > influxdata-archive.key \
    && \
echo '943666881a1b8d9b849b74caebf02d3465d6beb716510d86a39f6c8e8dac7515 influxdata-archive.key' | sha256sum -c && cat influxdata-archive.key | gpg --dearmor | tee /etc/apt/trusted.gpg.d/influxdata-archive.gpg > /dev/null \
    && \
echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive.gpg] https://repos.influxdata.com/debian stable main' | tee /etc/apt/sources.list.d/influxdata.list \
    && \
apt-get update && apt-get install telegraf

# Install influx v2 Cloud CLI for use in tests.
# Follow the install instructions(https://portal.influxdata.com/downloads/), except for sudo (which isn't available in Docker).
# influxdata-archive_compat.key GPG fingerprint:
#     9D53 9D90 D332 8DC7 D6C8 D3B9 D8FF 8E1F 7DF8 B07E
RUN wget -q https://repos.influxdata.com/influxdata-archive_compat.key \
    && \
echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null \
    && \
echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | tee /etc/apt/sources.list.d/influxdata.list \
    && \
apt-get update && apt-get install influxdb2-cli

ENV TEMP_DIR=/usr/src/app/test/tmp
ENTRYPOINT [ "run-tests.sh" ]
CMD [""]
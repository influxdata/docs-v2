# Use the Dockerfile 1.2 syntax to leverage BuildKit features like cache mounts and inline mounts--temporary mounts that are only available during the build step, not at runtime.
# syntax=docker/dockerfile:1.2

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
  python3 \
  python3-pip \
  python3-venv \
  wget

RUN ln -s /usr/bin/python3 /usr/bin/python

# Copy test scripts and configuration files to the container (no sensitive data).
COPY ./test/app /app
WORKDIR /app

# Create a virtual environment for Python to avoid conflicts with the system Python and having to use the --break-system-packages flag when installing packages with pip.
RUN python -m venv /opt/venv
# Enable venv
ENV PATH="/opt/venv/bin:$PATH"
# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

# Some Python test dependencies (pytest-dotenv and pytest-codeblocks) aren't
# available as packages in apt-cache, so use pip to download dependencies in a # separate step and use Docker's caching.
RUN pip install -Ur ./requirements.txt

RUN mv ./parse_yaml.sh /usr/local/bin/parse_yaml
RUN mv ./run-tests.sh /usr/local/bin/run-tests
RUN chmod +x /usr/local/bin/parse_yaml /usr/local/bin/run-tests

# Install InfluxDB keys to verify client installs.
# Follow the install instructions (https://docs.influxdata.com/telegraf/v1/install/?t=curl), except for sudo (which isn't available in Docker).
# influxdata-archive_compat.key GPG fingerprint:
#     9D53 9D90 D332 8DC7 D6C8 D3B9 D8FF 8E1F 7DF8 B07E
RUN wget -q https://repos.influxdata.com/influxdata-archive_compat.key

RUN echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null

RUN echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | tee /etc/apt/sources.list.d/influxdata.list

# Install InfluxDB clients to use in tests. 
RUN apt-get update && apt-get -y install telegraf influxdb2-cli

ENV CURRENT_WORKDIR=/app

ENTRYPOINT [ "run-tests" ]
CMD [""]

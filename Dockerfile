# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

FROM python:3.12.0-slim-bookworm

RUN apt-get update && apt-get install -y \
  curl \
  git \
  gpg \
  wget \
   && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ARG SOURCE_DIR

COPY test ./test
COPY data ./test/data

RUN chmod -R 755 .

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app/${SOURCE_DIR}

COPY test/run-tests.sh /usr/local/bin/run-tests.sh
RUN chmod +x /usr/local/bin/run-tests.sh

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=test/requirements.txt,target=./requirements.txt \
    python -m pip install -r ./requirements.txt

# RUN --mount=type=cache,target=/root/.cache/node_modules \
#     --mount=type=bind,source=package.json,target=package.json \
#     npm install

# Install Telegraf for use in tests.
# Follow the install instructions (https://docs.influxdata.com/telegraf/v1/install/?t=curl), except for sudo (which isn't available in Docker).
# influxdata-archive_compat.key GPG Fingerprint: 9D539D90D3328DC7D6C8D3B9D8FF8E1F7DF8B07E
RUN curl -s https://repos.influxdata.com/influxdata-archive_compat.key > influxdata-archive_compat.key \
    && \
echo '393e8779c89ac8d958f81f942f9ad7fb82a25e133faddaf92e15b16e6ac9ce4c influxdata-archive_compat.key' | sha256sum -c && cat influxdata-archive_compat.key | gpg --dearmor | tee /etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg > /dev/null \
    && \
echo 'deb [signed-by=/etc/apt/trusted.gpg.d/influxdata-archive_compat.gpg] https://repos.influxdata.com/debian stable main' | tee /etc/apt/sources.list.d/influxdata.list \
    && \
apt-get update && apt-get install telegraf

ENV TEMP_DIR=./tmp
ENTRYPOINT [ "run-tests.sh" ]
CMD [""]
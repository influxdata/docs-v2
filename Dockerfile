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

ENV TEMP_DIR=./tmp
ENTRYPOINT [ "run-tests.sh" ]
CMD [""]
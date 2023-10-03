# syntax=docker/dockerfile:1

# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG PYTHON_VERSION=3.11.5

FROM python:${PYTHON_VERSION}-slim as base

RUN apt-get update && apt-get install -y \
  curl \
  git \
   && rm -rf /var/lib/apt/lists/*

ARG SOURCE_DIR
ARG TESTS_DIR

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

COPY $SOURCE_DIR /app/$SOURCE_DIR

WORKDIR /app/$SOURCE_DIR
RUN chmod -R 755 /app/$SOURCE_DIR

COPY $SOURCE_DIR/run-tests.sh /usr/local/bin/run-tests.sh
RUN chmod +x /usr/local/bin/run-tests.sh

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.cache/pip to speed up subsequent builds.
# Leverage a bind mount to requirements.txt to avoid having to copy them into
# into this layer.
RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=${SOURCE_DIR}/requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

# RUN --mount=type=cache,target=/root/.cache/node_modules \
#     --mount=type=bind,source=package.json,target=package.json \
#     npm install

WORKDIR $TESTS_DIR
ENTRYPOINT ["run-tests.sh"]
CMD [""]

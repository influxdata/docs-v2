# Use the official Golang 1.21 image as the base image
FROM golang:1.21

# Set the working directory inside the container
WORKDIR /app

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    git \
    make \
    wget \
    tar \
    bash \
    openssh-client

# Configure SSH for GitHub access
RUN mkdir -p /root/.ssh && chmod 0700 /root/.ssh
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts

# Clone the telegraf-internal repository using SSH
# Use the --mount option to access the SSH agent
RUN --mount=type=ssh git clone git@github.com:influxdata/telegraf-internal.git

# Set the working directory to the cloned repository
WORKDIR /app/telegraf-internal

# Checkout the docs branch
RUN git checkout docs

# (Optional) Ensure Go modules are enabled
ENV GO111MODULE=on

# Fetch dependencies (if using Go modules)
RUN go mod tidy

# Remove binaries from the previous build
RUN make clean

# Build the release binaries
RUN make release

# Set the working directory to the docs directory
WORKDIR /app/telegraf-internal/telegraf_release/docs

# Run the docs binary. In your docker run command, specify the Telegraf release tag
CMD ["/app/telegraf-internal/telegraf_release/bin/docs"]
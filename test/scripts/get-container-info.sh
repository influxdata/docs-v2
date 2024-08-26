#!/bin/bash

# Function to check if the script is running inside a Docker container
is_running_in_docker() {
    if [ -f /.dockerenv ]; then
        return 0
    fi

    if grep -qE '/docker|/lxc' /proc/1/cgroup; then
        return 0
    fi

    return 1
}

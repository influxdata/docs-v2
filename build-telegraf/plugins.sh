#!/bin/bash

# Determine the root project directory
ROOT_DIR=$(git rev-parse --show-toplevel)

# Clone an external repository
git clone https://github.com/influxdata/telegraf.git "$ROOT_DIR/external/telegraf"

# Update the external repository
cd "$ROOT_DIR/external/telegraf"
git pull origin master

# Function to create a Hugo page
create_page() {
  local plugin_dir=$1
  local dest_dir=$2
  local dest_file="$dest_dir/_index.md"
  local parent=$3

  # Check if the plugin directory exists
  if [ -d "$plugin_dir" ]; then
    mkdir -p "$dest_dir"
    # Use a heredoc to write the frontmatter to the destination file
    cat <<EOF > "$dest_file"
---
description: "Telegraf plugin for collecting metrics from $plugin_dir"
menu:
  telegraf_v1_ref:
    parent: $parent
    name: $(basename "$plugin_dir")
tags: [$(basename "$plugin_dir")]
---

EOF
  else
    echo "Plugin directory not found: $plugin_dir"
  fi
}

# Function to copy README.md content to _index.md
copy_readme() {
  local plugin_dir=$1
  local src_readme="$plugin_dir/README.md"
  local dest_dir=$2
  local dest_file="$dest_dir/_index.md"

  # If src_readme doesn't exist, then return an error
  if [ ! -f "$src_readme" ]; then
    echo "README.md not found in $plugin_dir"
    return 1
  fi
  # If $dest_file doesn't exist, then return an error
  if [ ! -f "$dest_file" ]; then
    echo "$dest_file not found"
    return 1
  fi

  # Copy the README.md content to _index.md
  cat $src_readme >> $dest_file
  echo "Copied $src_readme to $dest_file"
}

# Semaphore function to limit concurrent processes
semaphore() {
  local max_concurrent=$1
  while [ "$(jobs -r | wc -l)" -ge "$max_concurrent" ]; do
    sleep 0.1
  done
}

# Limit the number of concurrent processes
MAX_CONCURRENT=10

build() {
  # For each plugin in external/telegraf/plugins/inputs,
  # copy the README.md file to content.
  local input_plugins_dir="$ROOT_DIR/content/telegraf/v1/input-plugins"
  cat <<EOF > "$input_plugins_dir/_index.md"
---
title: "Telegraf Input Plugins"
description: "Telegraf input plugins collect metrics from the system, services, and third-party APIs."
menu:
  telegraf_v1_ref:
    name: Input Plugins
    identifier: input-plugins
    weight: 10
tags: [input-plugins]
---

EOF

  for plugin_dir in "$ROOT_DIR/external/telegraf/plugins/inputs"/*; do
    if [ -d "$plugin_dir" ]; then
      # If the directory name is "all", then skip it
      if [ "$(basename "$plugin_dir")" == "all" ]; then
        continue
      fi
      local plugin_name=$(basename "$plugin_dir")
      local dest_dir=$input_plugins_dir/$plugin_name
      semaphore "$MAX_CONCURRENT"
      (
        create_page "$plugin_dir" "$dest_dir" "Input Plugins"
        copy_readme "$plugin_dir" "$dest_dir"
      ) & 
    fi
  done

  # Wait for all background jobs to finish
  wait
}

build

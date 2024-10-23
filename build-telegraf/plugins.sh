#!/bin/bash

# Determine the root project directory
ROOT_DIR=$(git rev-parse --show-toplevel)

# If the Telegraf repo isn't already cloned in ./external, clone it 

if [ ! -d "$ROOT_DIR/external/telegraf" ]; then
  git clone https://github.com/influxdata/telegraf.git "$ROOT_DIR/external/telegraf"
fi
# Update the external repository
cd "$ROOT_DIR/external/telegraf"
git pull origin master

# Function to create a Hugo page
create_page() {
  local dest_dir=$1
  local dest_file="$dest_dir/_index.md"
  local content=$2

  mkdir -p "$dest_dir"
  echo "$content" > "$dest_file"
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
  cat "$src_readme" >> "$dest_file"
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
MAX_CONCURRENT=5

# Function to generate frontmatter for input plugins
input_plugin_frontmatter() {
  local plugin_name=$1

  cat <<EOF
---
description: "Telegraf plugin for collecting metrics from $plugin_name"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: $plugin_name
    identifier: "$plugin_name-input-plugin"
tags: [$plugin_name, "input-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

EOF
}

# Function to generate frontmatter for output plugins
output_plugin_frontmatter() {
  local plugin_name=$1

  cat <<EOF
---
description: "Telegraf plugin for sending metrics to $plugin_name"
menu:
  telegraf_v1_ref:
    parent: output_plugins_reference 
    name: $plugin_name
    identifier: "$plugin_name-output-plugin"
tags: [$plugin_name, "output-plugins", "configuration"]
related:
  - /telegraf/v1/configure_plugins/
---

EOF
}

# Build function to create pages and copy README.md files
build() {
  local src_dir=$1
  local dest_dir=$2
  local frontmatter_func=$3
  local main_frontmatter=$4

  # Create the main index file for plugins
  echo "$main_frontmatter" > "$dest_dir/_index.md"

  for plugin_dir in "$src_dir"/*; do
    # If the directory name is "all", then skip it
    if [ "$(basename "$plugin_dir")" == "all" ]; then
      continue
    fi
    local plugin_name=$(basename "$plugin_dir")
    local plugin_dest_dir=$dest_dir/$plugin_name
    if [ -d "$plugin_dir" ]; then
      semaphore "$MAX_CONCURRENT"
      (
        local frontmatter=$($frontmatter_func "$plugin_name")
        create_page "$plugin_dest_dir" "$frontmatter"
        copy_readme "$plugin_dir" "$plugin_dest_dir"
      ) &
    fi
  done

  # Wait for all background jobs to finish
  wait
}

# Configuration for input plugins
SRC_DIR_INPUT="$ROOT_DIR/external/telegraf/plugins/inputs"
DEST_DIR_INPUT="$ROOT_DIR/content/telegraf/v1/input-plugins"
FRONTMATTER_FUNC_INPUT="input_plugin_frontmatter"
MAIN_FRONTMATTER_INPUT=$(cat <<EOF
---
title: "Telegraf Input Plugins"
description: "Telegraf input plugins collect metrics from the system, services, and third-party APIs."
menu:
  telegraf_v1_ref:
    name: Input plugins
    identifier: input_plugins_reference
    weight: 10
tags: [input-plugins]
---

Telegraf input plugins collect metrics from the system, services, and third-party APIs.

{{< children >}}

EOF
)

# Run the build function for input plugins
build "$SRC_DIR_INPUT" "$DEST_DIR_INPUT" "$FRONTMATTER_FUNC_INPUT" "$MAIN_FRONTMATTER_INPUT"

# Configuration for output plugins
SRC_DIR_OUTPUT="$ROOT_DIR/external/telegraf/plugins/outputs"
DEST_DIR_OUTPUT="$ROOT_DIR/content/telegraf/v1/output-plugins"
FRONTMATTER_FUNC_OUTPUT="output_plugin_frontmatter"
MAIN_FRONTMATTER_OUTPUT=$(cat <<EOF
---
title: "Telegraf Output Plugins"
description: "Telegraf output plugins send metrics to various destinations."
menu:
  telegraf_v1_ref:
    name: Output plugins
    identifier: output_plugins_reference
    weight: 20
tags: [output-plugins]
---

Telegraf output plugins send metrics to various destinations.

{{< children >}}

EOF
)

# Run the build function for output plugins
build "$SRC_DIR_OUTPUT" "$DEST_DIR_OUTPUT" "$FRONTMATTER_FUNC_OUTPUT" "$MAIN_FRONTMATTER_OUTPUT"
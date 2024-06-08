# Description: This script is used to lint the content of the InfluxDB 
# documentation using Vale.
# This script lints staged and unstaged changed files and reports Vale suggestions, warnings, and errors.
# The linter output is more exhaustive than the error-level-only reporting 
# currently run in the pre-commit hook and may be useful for extensive refactoring and cleanup of documentation.
#
# We can use this script to help track and resolve warnings and suggestions
# until we can comfortably raise our pre-commit Vale minAlertLevel to "warning".
# At that point, we can remove this script and rely on the pre-commit hook to 
# lint the content. 
# Usage: bash vale.sh

# Use the path for the Vale binary.
# Not ideal, but yarn run can't find it otherwise.
VALE=./node_modules/@vvago/vale/bin/vale


# Lint cloud-dedicated
pages_path="$contentpath/influxdb/cloud-dedicated"
changed_files=$(list_changed_files "$pages_path/*.md")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$pages_path/.vale.ini" $files
fi

# Lint cloud-serverless
pages_path="$contentpath/influxdb/cloud-serverless"
changed_files=$(list_changed_files "$pages_path/*.md")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$pages_path/.vale.ini" $files
fi

# Lint clustered
pages_path="$contentpath/influxdb/clustered"
changed_files=$(list_changed_files "$pages_path/*.md")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$pages_path/.vale.ini" $files
fi

# Lint cloud 
pages_path="$contentpath/influxdb/cloud"
changed_files=$(list_changed_files "$pages_path/*.md")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$docspath/.vale.ini" $files
fi

# Lint v2 
pages_path="$contentpath/influxdb/v2"
changed_files=$(list_changed_files "$pages_path/*.md")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$docspath/.vale.ini" $files
fi

# Lint telegraf
pages_path="$contentpath/influxdb/telegraf"
changed_files=$(list_changed_files "$pages_path/*.md")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$docspath/.vale.ini" $files
fi

# Lint api-docs
pages_path="$contentpath/api-docs"
changed_files=$(list_changed_files "$pages_path/*.yml")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$docspath/.vale.ini" $files
fi

# Lint top-level pages (for example, README.md) 
changed_files=$(list_changed_files "$docspath/*.md" "cwd")
files=$(echo "$changed_files" | tr '\n' ' ' | xargs)
# If files are found, lint them
if [ ! -z "$files" ]; then
    $VALE --config="$docspath/.vale.ini" $files
fi

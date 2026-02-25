#!/bin/bash
# Check for non-standard InfluxData support links
# Standard link: https://support.influxdata.com (no trailing slash, no path)

set -e

EXIT_CODE=0

echo "Checking for non-standard InfluxData support links..."

# Find all markdown files with non-standard support.influxdata.com URLs
# Check for URLs with paths (/s/contactsupport, /s/login, etc.)
if grep -rn "https://support\.influxdata\.com/[^)\s]*" content --include="*.md" | grep -v "https://support\.influxdata\.com)"; then
    echo ""
    echo "ERROR: Found support.influxdata.com URLs with paths or trailing slashes."
    echo "Please use the standard format: https://support.influxdata.com"
    echo ""
    EXIT_CODE=1
fi

if [ $EXIT_CODE -eq 0 ]; then
    echo "✓ All support links use the standard format."
fi

exit $EXIT_CODE

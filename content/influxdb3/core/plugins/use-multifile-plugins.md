---
title: Use multi-file Python code and modules in plugins
description: |
  Organize complex plugin logic across multiple Python files and modules for better code reuse, testing, and maintainability in InfluxDB 3 Processing Engine plugins.
menu:
  influxdb3_core:
    name: Use multi-file plugins
    parent: Processing engine and Python plugins
weight: 101
influxdb3/core/tags: [processing engine, plugins, python, modules]
related:
- /influxdb3/core/plugins/
- /influxdb3/core/plugins/extend-plugin/
- /influxdb3/core/reference/cli/influxdb3/create/trigger/
---

As your plugin logic grows in complexity, organizing code across multiple Python files improves maintainability, enables code reuse, and makes testing easier.
The InfluxDB 3 Processing Engine supports multi-file plugin architectures using standard Python module patterns.

## Before you begin

Ensure you have:

- A working InfluxDB 3 Core instance with the Processing Engine enabled
- Basic understanding of [Python modules and packages](https://docs.python.org/3/tutorial/modules.html)
- Familiarity with [creating InfluxDB 3 plugins](/influxdb3/core/plugins/)

## Multi-file plugin structure

A multi-file plugin is a directory containing Python files organized as a package.
The directory must include an `__init__.py` file that serves as the entry point and contains your trigger function.

### Basic structure

```
my_plugin/
├── __init__.py       # Required - entry point with trigger function
├── processors.py     # Data processing functions
├── utils.py          # Helper utilities
└── config.py         # Configuration management
```

### Required: **init**.py entry point

The `__init__.py` file must contain the trigger function that InfluxDB calls when the trigger fires.
This file imports and orchestrates code from other modules in your plugin.

```python
# my_plugin/__init__.py
from .processors import process_data
from .config import load_settings
from .utils import format_output

def process_writes(influxdb3_local, table_batches, args=None):
    """Entry point for WAL trigger."""
    settings = load_settings(args)

    for table_batch in table_batches:
        processed_data = process_data(table_batch, settings)
        output = format_output(processed_data)
        influxdb3_local.write(output)
```

## Organizing plugin code

### Separate concerns into modules

Organize your plugin code by functional responsibility to improve maintainability and testing.

#### processors.py - Data transformation logic

```python
# my_plugin/processors.py
"""Data processing and transformation functions."""

def process_data(table_batch, settings):
    """Transform data according to configuration settings."""
    table_name = table_batch["table_name"]
    rows = table_batch["rows"]

    transformed_rows = []
    for row in rows:
        transformed = transform_row(row, settings)
        if transformed:
            transformed_rows.append(transformed)

    return {
        "table": table_name,
        "rows": transformed_rows,
        "count": len(transformed_rows)
    }

def transform_row(row, settings):
    """Apply transformations to a single row."""
    # Apply threshold filtering
    if "value" in row and row["value"] < settings.get("min_value", 0):
        return None

    # Apply unit conversion if configured
    if settings.get("convert_units"):
        row["value"] = row["value"] * settings.get("conversion_factor", 1.0)

    return row
```

#### config.py - Configuration management

```python
# my_plugin/config.py
"""Plugin configuration parsing and validation."""

DEFAULT_SETTINGS = {
    "min_value": 0.0,
    "convert_units": False,
    "conversion_factor": 1.0,
    "output_measurement": "processed_data",
}

def load_settings(args):
    """Load and validate plugin settings from trigger arguments."""
    settings = DEFAULT_SETTINGS.copy()

    if not args:
        return settings

    # Parse numeric arguments
    if "min_value" in args:
        settings["min_value"] = float(args["min_value"])

    if "conversion_factor" in args:
        settings["conversion_factor"] = float(args["conversion_factor"])

    # Parse boolean arguments
    if "convert_units" in args:
        settings["convert_units"] = args["convert_units"].lower() in ("true", "1", "yes")

    # Parse string arguments
    if "output_measurement" in args:
        settings["output_measurement"] = args["output_measurement"]

    return settings

def validate_settings(settings):
    """Validate settings and raise exceptions for invalid configurations."""
    if settings["min_value"] < 0:
        raise ValueError("min_value must be non-negative")

    if settings["conversion_factor"] <= 0:
        raise ValueError("conversion_factor must be positive")

    return True
```

#### utils.py - Helper functions

```python
# my_plugin/utils.py
"""Utility functions for data formatting and logging."""

from datetime import datetime

def format_output(processed_data):
    """Format processed data for writing to InfluxDB."""
    from influxdb3_local import LineBuilder

    lines = []
    measurement = processed_data.get("measurement", "processed_data")

    for row in processed_data["rows"]:
        line = LineBuilder(measurement)

        # Add tags from row
        for key, value in row.items():
            if key.startswith("tag_"):
                line.tag(key.replace("tag_", ""), str(value))

        # Add fields from row
        for key, value in row.items():
            if key.startswith("field_"):
                field_name = key.replace("field_", "")
                if isinstance(value, float):
                    line.float64_field(field_name, value)
                elif isinstance(value, int):
                    line.int64_field(field_name, value)
                elif isinstance(value, str):
                    line.string_field(field_name, value)

        lines.append(line)

    return lines

def log_metrics(influxdb3_local, operation, duration_ms, record_count):
    """Log plugin performance metrics."""
    influxdb3_local.info(
        f"Operation: {operation}, "
        f"Duration: {duration_ms}ms, "
        f"Records: {record_count}"
    )
```

## Importing external libraries

Multi-file plugins can use both relative imports (for your own modules) and absolute imports (for external libraries).

### Relative imports for plugin modules

Use relative imports to reference other modules within your plugin:

```python
# my_plugin/__init__.py
from .processors import process_data      # Same package
from .config import load_settings         # Same package
from .utils import format_output          # Same package

# Relative imports from subdirectories
from .transforms.aggregators import calculate_mean
from .integrations.webhook import send_notification
```

### Absolute imports for external libraries

Use absolute imports for standard library and third-party packages:

```python
# my_plugin/processors.py
import json
import time
from datetime import datetime, timedelta
from collections import defaultdict

# Third-party libraries (must be installed with influxdb3 install package)
import pandas as pd
import numpy as np
```

### Installing third-party dependencies

Before using external libraries, install them into the Processing Engine's Python environment:

```bash
# Install packages for your plugin
influxdb3 install package pandas numpy requests
```

For Docker deployments:

```bash
docker exec -it CONTAINER_NAME influxdb3 install package pandas numpy requests
```

## Advanced plugin patterns

### Nested module structure

For complex plugins, organize code into subdirectories:

```
my_advanced_plugin/
├── __init__.py
├── config.py
├── transforms/
│   ├── __init__.py
│   ├── aggregators.py
│   └── filters.py
├── integrations/
│   ├── __init__.py
│   ├── webhook.py
│   └── email.py
└── utils/
    ├── __init__.py
    ├── logging.py
    └── validators.py
```

Import from nested modules:

```python
# my_advanced_plugin/__init__.py
from .transforms.aggregators import calculate_statistics
from .transforms.filters import apply_threshold_filter
from .integrations.webhook import send_alert
from .utils.logging import setup_logger

def process_writes(influxdb3_local, table_batches, args=None):
    logger = setup_logger(influxdb3_local)

    for table_batch in table_batches:
        # Filter data
        filtered = apply_threshold_filter(table_batch, threshold=100)

        # Calculate statistics
        stats = calculate_statistics(filtered)

        # Send alerts if needed
        if stats["max"] > 1000:
            send_alert(stats, logger)
```

### Shared code across plugins

Share common code across multiple plugins using a shared module directory:

```
plugins/
├── shared/
│   ├── __init__.py
│   ├── formatters.py
│   └── validators.py
├── plugin_a/
│   └── __init__.py
└── plugin_b/
    └── __init__.py
```

Add the shared directory to Python's module search path in your plugin:

```python
# plugin_a/__init__.py
import sys
from pathlib import Path

# Add shared directory to path
plugin_dir = Path(__file__).parent.parent
sys.path.insert(0, str(plugin_dir))

# Now import from shared
from shared.formatters import format_line_protocol
from shared.validators import validate_data

def process_writes(influxdb3_local, table_batches, args=None):
    for table_batch in table_batches:
        if validate_data(table_batch):
            formatted = format_line_protocol(table_batch)
            influxdb3_local.write(formatted)
```

## Testing multi-file plugins

### Unit testing individual modules

Test modules independently before integration:

```python
# tests/test_processors.py
import unittest
from my_plugin.processors import transform_row
from my_plugin.config import load_settings

class TestProcessors(unittest.TestCase):
    def test_transform_row_filtering(self):
        """Test that rows below threshold are filtered."""
        settings = {"min_value": 10.0}
        row = {"value": 5.0}

        result = transform_row(row, settings)

        self.assertIsNone(result)

    def test_transform_row_conversion(self):
        """Test unit conversion."""
        settings = {
            "convert_units": True,
            "conversion_factor": 2.0,
            "min_value": 0.0
        }
        row = {"value": 10.0}

        result = transform_row(row, settings)

        self.assertEqual(result["value"], 20.0)

if __name__ == "__main__":
    unittest.main()
```

### Testing with the influxdb3 CLI

Test your complete multi-file plugin before deployment:

```bash
# Test scheduled plugin
influxdb3 test schedule_plugin \
  --database testdb \
  --schedule "0 0 * * * *" \
  --plugin-dir /path/to/plugins \
  my_plugin

# Test WAL plugin with sample data
influxdb3 test wal_plugin \
  --database testdb \
  --plugin-dir /path/to/plugins \
  my_plugin
```

For more testing options, see the [influxdb3 test reference](/influxdb3/core/reference/cli/influxdb3/test/).

## Deploying multi-file plugins

### Upload plugin directory

Upload your complete plugin directory when creating a trigger:

```bash
# Upload the entire plugin directory
influxdb3 create trigger \
  --trigger-spec "table:sensor_data" \
  --path "/local/path/to/my_plugin" \
  --upload \
  --database mydb \
  sensor_processor
```

The `--upload` flag transfers all files in the directory to the server's plugin directory.

### Update plugin code

Update all files in a running plugin:

```bash
# Update the plugin with new code
influxdb3 update trigger \
  --database mydb \
  --trigger-name sensor_processor \
  --path "/local/path/to/my_plugin"
```

The update replaces all plugin files while preserving trigger configuration.

## Best practices

### Code organization

- **Single responsibility**: Each module should have one clear purpose
- **Shallow hierarchies**: Avoid deeply nested directory structures (2-3 levels maximum)
- **Descriptive names**: Use clear, descriptive module and function names
- **Module size**: Keep modules under 300-400 lines for maintainability

### Import management

- **Explicit imports**: Use explicit imports rather than `from module import *`
- **Standard library first**: Import standard library, then third-party, then local modules
- **Avoid circular imports**: Design modules to prevent circular dependencies

Example import organization:

```python
# Standard library
import json
import time
from datetime import datetime

# Third-party packages
import pandas as pd
import numpy as np

# Local modules
from .config import load_settings
from .processors import process_data
from .utils import format_output
```

### Error handling

Centralize error handling in your entry point:

```python
# my_plugin/__init__.py
from .processors import process_data
from .config import load_settings, validate_settings

def process_writes(influxdb3_local, table_batches, args=None):
    try:
        # Load and validate configuration
        settings = load_settings(args)
        validate_settings(settings)

        # Process data
        for table_batch in table_batches:
            process_data(influxdb3_local, table_batch, settings)

    except ValueError as e:
        influxdb3_local.error(f"Configuration error: {e}")
    except Exception as e:
        influxdb3_local.error(f"Unexpected error: {e}")
```

### Documentation

Document your modules with docstrings:

```python
"""
my_plugin - Data processing plugin for sensor data.

This plugin processes incoming sensor data by:
1. Filtering values below configured threshold
2. Converting units if requested
3. Writing processed data to output measurement

Modules:
- processors: Core data transformation logic
- config: Configuration parsing and validation
- utils: Helper functions for formatting and logging
"""

def process_writes(influxdb3_local, table_batches, args=None):
    """Process incoming sensor data writes.

    Args:
        influxdb3_local: InfluxDB API interface
        table_batches: List of table batches with written data
        args: Optional trigger arguments for configuration

    Trigger arguments:
        min_value (float): Minimum value threshold
        convert_units (bool): Enable unit conversion
        conversion_factor (float): Conversion multiplier
        output_measurement (str): Target measurement name
    """
    pass
```

## Example: Complete multi-file plugin

Here's a complete example of a temperature monitoring plugin with multi-file organization:

### Plugin structure

```
temperature_monitor/
├── __init__.py
├── config.py
├── processors.py
└── alerts.py
```

### **init**.py

```python
# temperature_monitor/__init__.py
"""Temperature monitoring plugin with alerting."""

from .config import load_config
from .processors import calculate_statistics
from .alerts import check_thresholds

def process_scheduled_call(influxdb3_local, call_time, args=None):
    """Monitor temperature data and send alerts."""
    try:
        config = load_config(args)

        # Query recent temperature data
        query = f"""
            SELECT temp_value, location
            FROM {config['measurement']}
            WHERE time > now() - INTERVAL '{config['window']}'
        """
        results = influxdb3_local.query(query)

        # Calculate statistics
        stats = calculate_statistics(results)

        # Check thresholds and alert
        check_thresholds(influxdb3_local, stats, config)

        influxdb3_local.info(
            f"Processed {len(results)} readings "
            f"from {len(stats)} locations"
        )

    except Exception as e:
        influxdb3_local.error(f"Plugin error: {e}")
```

### config.py

```python
# temperature_monitor/config.py
"""Configuration management for temperature monitor."""

DEFAULTS = {
    "measurement": "temperature",
    "window": "1 hour",
    "high_threshold": 30.0,
    "low_threshold": 10.0,
    "alert_measurement": "temperature_alerts"
}

def load_config(args):
    """Load configuration from trigger arguments."""
    config = DEFAULTS.copy()

    if args:
        for key in DEFAULTS:
            if key in args:
                if key.endswith("_threshold"):
                    config[key] = float(args[key])
                else:
                    config[key] = args[key]

    return config
```

### processors.py

```python
# temperature_monitor/processors.py
"""Data processing functions."""

from collections import defaultdict

def calculate_statistics(data):
    """Calculate statistics by location."""
    stats = defaultdict(lambda: {
        "count": 0,
        "sum": 0.0,
        "min": float('inf'),
        "max": float('-inf')
    })

    for row in data:
        location = row.get("location", "unknown")
        value = float(row.get("temp_value", 0))

        s = stats[location]
        s["count"] += 1
        s["sum"] += value
        s["min"] = min(s["min"], value)
        s["max"] = max(s["max"], value)

    # Calculate averages
    for location, s in stats.items():
        if s["count"] > 0:
            s["avg"] = s["sum"] / s["count"]

    return dict(stats)
```

### alerts.py

```python
# temperature_monitor/alerts.py
"""Alert checking and notification."""

def check_thresholds(influxdb3_local, stats, config):
    """Check temperature thresholds and write alerts."""
    from influxdb3_local import LineBuilder

    high_threshold = config["high_threshold"]
    low_threshold = config["low_threshold"]
    alert_measurement = config["alert_measurement"]

    for location, s in stats.items():
        if s["max"] > high_threshold:
            line = LineBuilder(alert_measurement)
            line.tag("location", location)
            line.tag("severity", "high")
            line.float64_field("temperature", s["max"])
            line.string_field("message",
                f"High temperature: {s['max']}°C exceeds {high_threshold}°C")

            influxdb3_local.write(line)
            influxdb3_local.warn(f"High temperature alert for {location}")

        elif s["min"] < low_threshold:
            line = LineBuilder(alert_measurement)
            line.tag("location", location)
            line.tag("severity", "low")
            line.float64_field("temperature", s["min"])
            line.string_field("message",
                f"Low temperature: {s['min']}°C below {low_threshold}°C")

            influxdb3_local.write(line)
            influxdb3_local.warn(f"Low temperature alert for {location}")
```

### Deploy the plugin

```bash
# Create trigger with configuration
influxdb3 create trigger \
  --trigger-spec "every:5m" \
  --path "/local/path/to/temperature_monitor" \
  --upload \
  --trigger-arguments high_threshold=35,low_threshold=5,window="15 minutes" \
  --database sensors \
  temp_monitor
```

## Related resources

- [Processing engine and Python plugins](/influxdb3/core/plugins/)
- [Extend plugins with API features](/influxdb3/core/plugins/extend-plugin/)
- [Plugin library](/influxdb3/core/plugins/library/)
- [influxdb3 create trigger](/influxdb3/core/reference/cli/influxdb3/create/trigger/)
- [influxdb3 test](/influxdb3/core/reference/cli/influxdb3/test/)

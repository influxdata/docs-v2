The {{% product-name %}} processing engine is an embedded Python virtual machine
(VM) that runs code inside the database to process and transform data.
Create processing engine [plugins](#plugin) that run when [triggered](#trigger)
by specific events.

- [Processing engine terminology](#processing-engine-terminology)
  - [Plugin](#plugin)
  - [Trigger](#trigger)
    - [Trigger types](#trigger-types)
- [Activate the processing engine](#activate-the-processing-engine)
- [Create a plugin](#create-a-plugin)
- [Test a plugin on the server](#test-a-plugin-on-the-server)
- [Create a trigger](#create-a-trigger)
- [Enable the trigger](#enable-the-trigger)

## Processing engine terminology

### Plugin

A plugin is a Python function that has a signature compatible with a processing
engine [trigger](#trigger).

### Trigger

When you create a trigger, you specify a [plugin](#plugin), a database, optional
arguments, and a _trigger-spec_, which defines when the plugin is executed and
what data it receives.

#### Trigger types

InfluxDB 3 provides the following types of triggers, each with specific
trigger-specs:

- **On WAL flush**: Sends a batch of written data (for a specific table or all
  tables) to a plugin (by default, every second).
- **On Schedule**: Executes a plugin on a user-configured schedule (using a
  crontab or a duration). This trigger type is useful for data collection and
  deadman monitoring.
- **On Request**: Binds a plugin to a custom HTTP API endpoint at
  `/api/v3/engine/<ENDPOINT_PATH>`.
  The plugin receives the HTTP request headers and content, and can parse,
  process, and send the data into the database or to third-party services.

## Activate the processing engine

To activate the processing engine, include the `--plugin-dir <PLUGIN_DIR>` option
when starting the {{% product-name %}} server.
`PLUGIN_DIR` is your file system location for storing [plugin](#plugin) files for
the processing engine to run.

{{% code-placeholders "PLUGIN_DIR" %}}
<!-- pytest.mark.skip -->
```bash
influxdb3 serve \
  # ...
  --plugin-dir PLUGIN_DIR
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`PLUGIN_DIR`{{% /code-placeholder-key %}}
with the path to your plugin directory. This path can be absolute or relative
to the current working directory of the `influxdb3` server.

## Create a plugin

To create a plugin, write and store a Python file in your configured `PLUGIN_DIR`.
The following example is a WAL flush plugin that processes data before it gets
persisted to the object store.

##### Example Python plugin for WAL rows 

```python
# This is the basic structure for Python plugin code that runs in the
# InfluxDB 3 Processing engine.

# When creating a trigger, you can provide runtime arguments to your plugin,
# allowing you to write generic code that uses variables such as monitoring
# thresholds, environment variables, and host names.
#
# Use the following exact signature to define a function for the WAL flush
# trigger.
# When you create a trigger for a WAL flush plugin, you specify the database
# and tables that the plugin receives written data from on every WAL flush
# (default is once per second).
def process_writes(influxdb3_local, table_batches, args=None):
    # here you can see logging. for now this won't do anything, but soon 
    # we'll capture this so you can query it from system tables
    if args and "arg1" in args:
        influxdb3_local.info("arg1: " + args["arg1"])

    # here we're using arguments provided at the time the trigger was set up 
    # to feed into paramters that we'll put into a query
    query_params = {"room": "Kitchen"}
    # here's an example of executing a parameterized query. Only SQL is supported. 
    # It will query the database that the trigger is attached to by default. We'll 
    # soon have support for querying other DBs.
    query_result = influxdb3_local.query("SELECT * FROM home where room = '$host'", query_params)
    # the result is a list of Dict that have the column name as key and value as 
    # value. If you run the WAL test plugin with your plugin against a DB that 
    # you've written data into, you'll be able to see some results
    influxdb3_local.info("query result: " + str(query_result))

    # this is the data that is sent when the WAL is flushed of writes the server 
    # received for the DB or table of interest. One batch for each table (will 
    # only be one if triggered on a single table)
    for table_batch in table_batches:
        # here you can see that the table_name is available.
        influxdb3_local.info("table: " + table_batch["table_name"])

        # example to skip the table we're later writing data into
        if table_batch["table_name"] == "some_table":
            continue

        # and then the individual rows, which are Dict with keys of the column names and values
        for row in table_batch["rows"]:
            influxdb3_local.info("row: " + str(row))

    # this shows building a line of LP to write back to the database. tags must go first and 
    # their order is important and must always be the same for each individual table. Then 
    # fields and lastly an optional time, which you can see in the next example below
    line = LineBuilder("some_table")\
        .tag("tag1", "tag1_value")\
        .tag("tag2", "tag2_value")\
        .int64_field("field1", 1)\
        .float64_field("field2", 2.0)\
        .string_field("field3", "number three")
    
    # this writes it back (it actually just buffers it until the completion of this function
    # at which point it will write everything back that you put in)
    influxdb3_local.write(line)

    # here's another example, but with us setting a nanosecond timestamp at the end
    other_line = LineBuilder("other_table")
    other_line.int64_field("other_field", 1)
    other_line.float64_field("other_field2", 3.14)
    other_line.time_ns(1302)

    # and you can see that we can write to any DB in the server
    influxdb3_local.write_to_db("mytestdb", other_line)

    # just some log output as an example
    influxdb3_local.info("done")
```

## Test a plugin on the server

Use the [`influxdb3 test wal_plugin`](/influxdb3/version/reference/cli/influxdb3/test/wal_plugin/)
CLI command to test your processing engine plugin safely without
affecting actual data. During a plugin test:

- A query executed by the plugin queries against the server you send the request to.
- Writes aren't sent to the server but are returned to you.

To test a plugin:

1.  Save the [example plugin code](#example-python-plugin-for-wal-rows) to a
    plugin file inside of the plugin directory. If you haven't yet written data
    to the table in the example, comment out the lines where it queries.
2.  To run the test, enter the following command with the following options:

   - `--lp` or  `--file`: The line protocol to test
   - Optional: `--input-arguments`: A comma-delimited list of `<KEY>=<VALUE>` arguments for your plugin code

{{% code-placeholders "INPUT_LINE_PROTOCOL|INPUT_ARGS|DATABASE_NAME|AUTH_TOKEN|PLUGIN_FILENAME" %}}
```bash
influxdb3 test wal_plugin \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --lp INPUT_LINE_PROTOCOL \
  --input-arguments INPUT_ARGS \
  PLUGIN_FILENAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`INPUT_LINE_PROTOCOL`{{% /code-placeholder-key %}}: the line protocol to test
- Optional: {{% code-placeholder-key %}}`INPUT_ARGS`{{% /code-placeholder-key %}}: a comma-delimited list of `<KEY>=<VALUE>` arguments for your plugin code--for example, `arg1=hello,arg2=world`
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to test against
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: the {{% token-link "admin" %}} for your {{% product-name %}} server
- {{% code-placeholder-key %}}`PLUGIN_FILENAME`{{% /code-placeholder-key %}}: the name of the plugin file to test

The command runs the plugin code with the test data, yields the data to the
plugin code, and then responds with the plugin result.
You can quickly see how the plugin behaves, what data it would have written to
the database, and any errors.
You can then edit your Python code in the plugins directory, and rerun the test.
The server reloads the file for every request to the `test` API.

With the plugin code inside the server plugin directory, and a successful test,
you're ready to create a trigger for your server to run the plugin.

##### Example: Test and run a plugin

<!-- pytest.mark.skip -->
```bash
# Test a plugin
# Requires:
#   - A database named `mydb` with a table named `foo`
#   - A Python plugin file named `test.py`
# Test a plugin
influxdb3 test wal_plugin \
  --lp "my_measure,tag1=asdf f1=1.0 123" \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database sensors \
  --input-arguments "arg1=hello,arg2=world" \
  test.py
```

For more information, see [`influxdb3 test wal_plugin`](/influxdb3/version/reference/cli/influxdb3/test/wal_plugin/)
or run `influxdb3 test wal_plugin -h`.

## Create a trigger

With the plugin code inside the server plugin directory, and a successful test,
you're ready to create a trigger to run the plugin. Use the
[`influxdb3 create trigger` command](/influxdb3/version/reference/cli/influxdb3/create/trigger/)
to create a trigger.

```bash
# Create a trigger that runs the plugin
influxdb3 create trigger \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database sensors \
  --plugin test_plugin \
  --trigger-spec "table:foo" \
  --trigger-arguments "arg1=hello,arg2=world" \
  trigger1
```

## Enable the trigger

After you have created a plugin and trigger, enter the following command to
enable the trigger and have it run the plugin as you write data:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN|TRIGGER_NAME" %}}
```bash
influxdb3 enable trigger \
  --token AUTH_TOKEN \
  --database DATABASE_NAME \
  TRIGGER_NAME
```
{{% /code-placeholders %}}

Replace the following placeholders with your values:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to enable the trigger in
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "admin" %}}
- {{% code-placeholder-key %}}`TRIGGER_NAME`{{% /code-placeholder-key %}}: the name of the trigger to enable

For example, to enable the trigger named `trigger1` in the `sensors` database:

```bash
influxdb3 enable trigger \
  --token apiv3_0xxx0o0XxXxx00Xxxx000xXXxoo0== \
  --database sensors
  trigger1 
```

## Next steps

If you've completed this Get Started guide for {{% product-name %}},
learn more about options and tools for:

- [Writing data](/influxdb3/version/write-data/)
- [Querying data](/influxdb3/version/query-data/)
- [Processing data](/influxdb3/version/process-data/)
- [Visualizing data](/influxdb3/version/visualize-data/)

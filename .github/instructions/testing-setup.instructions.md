---
applyTo: "content/**/*.md, layouts/**/*.html"
---

### Detailed Testing Setup

#### Set up test scripts and credentials

Tests for code blocks require your InfluxDB credentials and other typical
InfluxDB configuration.

To set up your docs-v2 instance to run tests locally, do the following:

1. **Set executable permissions on test scripts** in `./test/src`:

   ```sh
   chmod +x ./test/src/*.sh
   ```

2. **Create credentials for tests**:
   
   - Create databases, buckets, and tokens for the product(s) you're testing.
   - If you don't have access to a Clustered instance, you can use your
Cloud Dedicated instance for testing in most cases. To avoid conflicts when
     running tests, create separate Cloud Dedicated and Clustered databases.

1. **Create .env.test**: Copy the `./test/env.test.example` file into each
    product directory to test and rename the file as `.env.test`--for example:
   
   ```sh
   ./content/influxdb/cloud-dedicated/.env.test
   ```
   
2. Inside each product's `.env.test` file, assign your InfluxDB credentials to
   environment variables:

   - Include the usual `INFLUX_` environment variables
   - In
   `cloud-dedicated/.env.test` and `clustered/.env.test` files, also define the
   following variables:

     - `ACCOUNT_ID`, `CLUSTER_ID`: You can find these values in your `influxctl`
       `config.toml` configuration file.
     - `MANAGEMENT_TOKEN`: Use the `influxctl management create` command to generate
       a long-lived management token to authenticate Management API requests

   See the substitution
   patterns in `./test/src/prepare-content.sh` for the full list of variables you may need to define in your `.env.test` files.

3. For influxctl commands to run in tests, move or copy your `config.toml` file
   to the `./test` directory.

> [!Warning]
> 
> - The database you configure in `.env.test` and any written data may
be deleted during test runs.
> - Don't add your `.env.test` files to Git. To prevent accidentally adding credentials to the docs-v2 repo,
> Git is configured to ignore `.env*` files. Consider backing them up on your local machine in case of accidental deletion.

#### Test shell and python code blocks

[pytest-codeblocks](https://github.com/nschloe/pytest-codeblocks/tree/main) extracts code from python and shell Markdown code blocks and executes assertions for the code.
If you don't assert a value (using a Python `assert` statement), `--codeblocks` considers a non-zero exit code to be a failure.

**Note**: `pytest --codeblocks` uses Python's `subprocess.run()` to execute shell code.

You can use this to test CLI and interpreter commands, regardless of programming
language, as long as they return standard exit codes.

To make the documented output of a code block testable, precede it with the
`<!--pytest-codeblocks:expected-output-->` tag and **omit the code block language
descriptor**--for example, in your Markdown file:

##### Example markdown

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

The next code block is treated as an assertion.
If successful, the output is the following:

```
Hello, world!
```

For commands, such as `influxctl` CLI commands, that require launching an
OAuth URL in a browser, wrap the command in a subshell and redirect the output
to `/shared/urls.txt` in the container--for example:

```sh
# Test the preceding command outside of the code block.
# influxctl authentication requires TTY interaction--
# output the auth URL to a file that the host can open.
script -c "influxctl user list " \
 /dev/null > /shared/urls.txt
```

You probably don't want to display this syntax in the docs, which unfortunately
means you'd need to include the test block separately from the displayed code
block.
To hide it from users, wrap the code block inside an HTML comment.
pytest-codeblocks will still collect and run the code block.

##### Mark tests to skip 

pytest-codeblocks has features for skipping tests and marking blocks as failed.
To learn more, see the pytest-codeblocks README and tests.

#### Troubleshoot tests

##### Pytest collected 0 items

Potential reasons:

- See the test discovery options in `pytest.ini`.
- For Python code blocks, use the following delimiter:

    ```python
    # Codeblocks runs this block.
    ```

  `pytest --codeblocks` ignores code blocks that use the following:

    ```py
    # Codeblocks ignores this block.
    ```


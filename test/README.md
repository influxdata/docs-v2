Test code blocks in Markdown files.

This project contains the following:

- `test.sh`: The primary entrypoint for running tests.
  Copies Markdown files to a temporary directory shared with the `test` Docker image and runs the test container.
- `test/run-tests.sh`: The Docker image entrypoint.
  Substitutes placeholders with environment variables in code blocks.
  Passes test files to test runners (for example, `pytest --codeblocks` for Python and shell code samples).
- `compose.yaml` and `Dockerfile`: Docker image for the **test** service that installs test dependencies and passes test files to test runners.

## Set configuration values

To set your InfluxDB credentials for testing, create the file `.env.influxdbv3` and add key=value properties for the following:

```text
INFLUX_HOST=https://us-east-1-1.aws.cloud2.influxdata.com
INFLUX_TOKEN=3S3SFrpFbnNR_pZ3Cr6LMN...==
INFLUX_ORG=28d1f2f.........
INFLUX_DATABASE=get-started
```

Storing configuration properties in a  `.env` (dotenv) file is generally preferable to using environment variables.

## Build the image

1.  Install Docker for your system.

2.  Build the Docker image.

    ```shell
    docker compose build test
    ```

    After editing configuration or files used by the image, re-run the preceding build command.

## Run tests

Test code blocks in Markdown files that have changed relative to your git `master` branch:

```sh
sh test.sh
```

Test code blocks in files that match a pattern:

```sh
sh test.sh ./content/**/*.md
```

`test.sh` copies files into `./test/tmp/` for testing and runs the tests in Docker.

### Test runners

_Experimental--work in progress_

[pytest-codeblocks](https://github.com/nschloe/pytest-codeblocks/tree/main) extracts code from python and shell Markdown code blocks and executes assertions for the code.
If you don't assert a value, `--codeblocks` considers a non-zero exit code to be a failure.
_Note_: `pytest --codeblocks` uses Python's `subprocess.run()` to execute shell code.

To assert (and display) the expected output of your code, follow the code block with the `<!--pytest-codeblocks:expected-output-->` comment tag, and then the expected output in a code block--for example:

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

If successful, the output is the following:

```
Hello, world!
```

pytest-codeblocks has features for skipping tests and marking blocks as failed.
To learn more, see the pytest-codeblocks README and tests.

#### Other tools and ideas for testing code blocks

The `codedown` NPM package extracts code from Markdown code blocks for each language and
can pipe the output to a test runner for the language.

`pytest` and `pytest-codeblocks` use the Python `Assertions` module to keep testing overhead low.
Node.js also provides an `Assertions` package.

The `runmd` NPM package runs `javascript` code blocks in Markdown and generates a new Markdown file with the code block output inserted.

## Troubleshoot

### Pytest collected 0 items

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
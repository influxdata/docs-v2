
# Telegraf release and docs build 

The Telegraf release build process (using code in `influxdata/telegraf-internal`) includes automation for building `influxdata/docs-v2` documentation from `influxdata/telegraf` plugin README files.

## Release build process

1. Telegraf team triggers the release script, which generates a `docs` binary.
   The binary takes a Telegraf release version tag as an argument.
2. When executed (by the Telegraf team for an official release or on your local
   system for testing), the binary:
   
   a. Clones the `docs-v2` repo and the `telegraf` repo and checks out the specified release tag.
   b. Applies `docs-v2` frontmatter templates (`docs-v2/telegraf-build/templates`) to the `telegraf` plugin README files.
   c. Commits the changes to the local `docs-v2` repo and creates a PR for the changes.

## Build Telegraf docs for local testing and preview

> [!Warn]
> 
> Use the following steps for local testing and preview only.
>
> _Don't commit the generated files to version control._
>
> Submit edits and fixes to the `/influxdata/telegraf` repo.
> The Telegraf release process triggers documentation builds and
> submits them to `influxdata/docs-v2` for review.
>  

Follow steps to test the Telegraf docs build process and preview generated docs on your local system (not for an official Telegraf release):

- [Build using Docker](#build-using-docker)
- [Build manually](#build-manually)

### Run Docker to build Telegraf docs for testing and preview 

1. If you don't already have an SSH key pair, generate one for your GitHub-associated email address, add your private key to your SSH agent, and add then add the public key to your GitHub account.

The Dockerfile leverages Docker's BuildKit and the `--ssh` flag to use your SSH keys for GitHub authentication.

1. Open a terminal and navigate to the directory containing the Dockerfile (`./scripts`), then enter the following command to build the Docker image:

   ```bash
   docker build --ssh default -t telegraf-build .
   ```

2. Run the Docker container using the built image and mount a volume to `/app/repos/docs-v2/telegraf`:

   ```bash
   docker run --rm \
   -v /Users/me/Documents/github/docs-v2/content/telegraf:/app/repos/docs-v2/content/telegraf \
   telegraf-build v1.33.0
   ```

Replace `/Users/me/Documents/github/docs-v2/content/telegraf` with the actual path on your host machine where you want to access the generated documentation.

### Manually build Telegraf docs for testing and preview

To test manually run the build process on your local system 
(without a release triggered by `influxdata/telegraf`):

1. Install a recent version of Go for your system. 

2. Clone the `influxdata/telegraf-internal` repo to your local system (for example, to `~/Documents/github/telegraf-internal`) 

3. To generate the release binaries (`telegraf-internal/telegraf_release/bin/`),change into the `~/Documents/github/telegraf-internal` directory and run `make`. 

4. To generate the documentation, run the `telegraf-internal/telegraf_release/bin/docs` binary and include the Telegraf release tag to build--for example:

  ```bash
  # Change to `telegraf-build` in your local docs-v2 repo.
  cd ~/Documents/github/docs-v2/telegraf-build
   # Run the `docs` binary to generate the documentation.
  ~/Documents/github/telegraf-internal/telegraf_release/bin/docs v1.33.0
  ```

  You can skip steps for local testing:

  ```bash
   ~/Documents/github/telegraf-internal/telegraf_release/bin/docs -skip changelog,pull-request v1.33.0
   ```

  The binary looks for `.tmpl` template files in `./templates` `telegraf-internal/telegraf_release/docs/templates/`, however we expect to permanently move them to `docs-v2/telegraf-build/templates` soon.

  The `docs` binary:
    a. Clones the `docs-v2` repo and the `telegraf` repo and checks out the specified Telegraf release tag.
    b. Commits the changes to the local `docs-v2` repo and creates a PR for the changes.

5. To test the templates and preview the changes on your local machine, change to `telegraf-build/repos/docs-v2`, install dependencies, and start Hugo:

   ```bash
   cd ~/Documents/github/docs-v2/telegraf-build/repos/docs-v2
   # Install dependencies
   yarn install
   # Start Hugo server
   npx hugo serve
   ```

   Alternatively, copy the generated files your existing local `docs-v2` repo (but, _don't_ commit them to version control).

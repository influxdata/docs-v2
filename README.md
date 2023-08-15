<p align="center">
  <img src="/static/img/influx-logo-cubo-dark.png" width="200">
</p>

# InfluxDB 2.0 Documentation

This repository contains the InfluxDB 2.x documentation published at [docs.influxdata.com](https://docs.influxdata.com).

## Contributing

We welcome and encourage community contributions.
For information about contributing to the InfluxData documentation, see [Contribution guidelines](CONTRIBUTING.md).

## Reporting a Vulnerability

InfluxData takes security and our users' trust very seriously.
If you believe you have found a security issue in any of our open source projects,
please responsibly disclose it by contacting security@influxdata.com.
More details about security vulnerability reporting,
including our GPG key, can be found at https://www.influxdata.com/how-to-report-security-vulnerabilities/.

## Running the docs locally

1. [**Clone this repository**](https://help.github.com/articles/cloning-a-repository/) to your local machine.

2.  **Install NodeJS, Yarn, Hugo, & Asset Pipeline Tools**

    The InfluxData documentation uses [Hugo](https://gohugo.io/), a static site generator built in Go. The site uses Hugo's asset pipeline, which requires the extended version of Hugo along with NodeJS tools like PostCSS, to build and process stylesheets and JavaScript.

    To install the required dependencies and build the assets, do the following:

    1. [Install NodeJS](https://nodejs.org/en/download/)
    2. [Install Yarn](https://classic.yarnpkg.com/en/docs/install/)
    3. In your terminal, from the `docs-v2` directory, install the dependencies:

          ```sh
          cd docs-v2
          yarn install
          ```

       _**Note:** The most recent version of Hugo tested with this documentation is **0.101.0**._

3. To generate the API docs, see [api-docs/README.md](api-docs/README.md).

4.  **Start the Hugo server**

    Hugo provides a local development server that generates the HTML pages, builds the static assets, and serves them at `localhost:1313`.

    In your terminal, start the Hugo server:

      ```sh
      npx hugo server
      ```
5. View the docs at [localhost:1313](http://localhost:1313).

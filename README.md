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

2. **Install Hugo**

    The InfluxData documentation uses [Hugo](https://gohugo.io/), a static site generator built in Go.
    The InfluxData documentation utilizes Hugo's asset pipeline and requires the extended version of Hugo.
    See the Hugo documentation for information about how to [download and install Hugo](https://gohugo.io/getting-started/installing/).

    _**Note:** The most recent version of Hugo tested with this documentation is **0.81.0**._

3.  **Install NodeJS, Yarn, & Asset Pipeline Tools**

    This project uses tools written in NodeJS to build and process stylesheets and javascript.
    To successfully build assets:

    1. [Install NodeJS](https://nodejs.org/en/download/)
    2. [Install Yarn](https://classic.yarnpkg.com/en/docs/install/)
    3. Run the following command to install the necessary tools:

      ```sh
      sudo yarn global add postcss-cli@8.3.0 autoprefixer@9.8.6
      ```

4.  **Start the Hugo server**

    Hugo provides a local development server that generates the HTML pages, builds
    the static assets, and serves them at `localhost:1313`.

    Start the Hugo server from the repository:

    ```
    $ cd docs-v2/
    $ hugo server
    ```

    View the docs at [localhost:1313](http://localhost:1313).

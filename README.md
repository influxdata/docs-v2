<p align="center">
  <img src="/static/img/influx-logo-cubo-dark.png" width="200">
</p>

# InfluxDB 2.0 Documentation
This repository contains the InfluxDB 2.x documentation published at [docs.influxdata.com](https://docs.influxdata.com).

## Contributing
We welcome and encourage community contributions. For information about contributing to the InfluxData documentation, see [Contribution guidelines](CONTRIBUTING.md).

## Reporting a Vulnerability
InfluxData takes security and our users' trust very seriously. 
If you believe you have found a security issue in any of our open source projects, 
please responsibly disclose it by contacting security@influxdata.com. 
More details about security vulnerability reporting, 
including our GPG key, can be found here. https://www.influxdata.com/how-to-report-security-vulnerabilities/

## Run the docs locally
The InfluxData documentation uses [Hugo](https://gohugo.io/), a static site
generator built in Go.

### Clone this repository
[Clone this repository](https://help.github.com/articles/cloning-a-repository/)
to your local machine.

### Install Hugo
See the Hugo documentation for information about how to
[download and install Hugo](https://gohugo.io/getting-started/installing/).

### Install NodeJS & Asset Pipeline Tools
This project uses tools written in NodeJS to build and process stylesheets and javascript.
In order for assets to build correctly, [install NodeJS](https://nodejs.org/en/download/)
and run the following command to install the necessary tools:

```sh
npm i -g postcss-cli autoprefixer
```

### Start the hugo server
Hugo provides a local development server that generates the HTML pages, builds
the static assets, and serves them at `localhost:1313`.

Start the hugo server with:

```bash
hugo server
```

View the docs at [localhost:1313](http://localhost:1313).

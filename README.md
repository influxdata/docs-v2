# InfluxDB v2.0 Documentation
This is the repository represents the InfluxDB v2.x documentation that will be
accessible at [docs.influxdata.com](https://docs.influxdata.com).

## Run the docs locally

### Install Hugo
Hugo is the static site generator used to build the InfluxData documentation.
[Download and install Hugo](https://gohugo.io/getting-started/installing/) to run the docs locally.

### Install NodeJS & Asset Pipeline Tools
This project uses tools built in NodeJS to build and process stylesheets and javascript.
In order for the asset pipeline to work, [install NodeJS](https://nodejs.org/en/download/)
and run the following to install the necessary tools:

```sh
npm i -g postcss-cli autoprefixer
```

### Fork and clone the docs repository
[Fork this repository](https://help.github.com/articles/fork-a-repo/) and [clone it](https://help.github.com/articles/cloning-a-repository/) to your local machine.

### Start the hugo server
Hugo provides a local development server that generates the HTML pages and serves them
at `localhost:1313`.

Start the hugo server with:

```bash
hugo server
```

View the docs at [localhost:1313](http://localhost:1313).

## Contributing
See our [Contribution guidelines](blob/master/CONTRIBUTING.md) for information
about contributing to the InfluxData documentation.

## Style & Formatting

### Markdown
All of our documentation is written in [Markdown](https://en.wikipedia.org/wiki/Markdown).

### Semantic Linefeeds
Use [semantic linefeeds](http://rhodesmill.org/brandon/2012/one-sentence-per-line/).
Separating each sentence with a new line makes it easy to parse diffs with the human eye.

**Diff without semantic linefeeds:**
``` diff
-Data are taking off. Those data are time series. You need a database that specializes in time series. You should check out InfluxDB.
+Data are taking off. Those data are time series. You need a database that specializes in time series. You need InfluxDB.
```

**Diff with semantic linefeeds:**
``` diff
Data are taking off.
Those data are time series.
You need a database that specializes in time series.
-You should check out InfluxDB.
+You need InfluxDB.
```

### Page frontmatter
Every documentation page includes frontmatter which specifies information about the page.
Frontmatter populates variables in page templates and the site's navigation menu.

```yaml
title: # Title of the page used in the the page's h1
seotitle: # Page title used in the html <head> title and used in search engine results
description: # Page description displayed in search engine results
menu:
  v2_0:
    name: # Article name that only appears in the left nav
    parent: # Specifies a parent group and nests navigation items
    weight: # Determines sort order.
draft: # If true, will not render page on build
```

#### Title usage

##### `title`
The `title` frontmatter populates each page's h1 header.
It shouldn't be overly long, but should set the context for users coming from outside sources.

##### `seotitle`
The `seotitle` frontmatter populates each page's HTML `title` attribute.
Search engines use this in search results (not the page's h1) and therefore it should be keyword optimized.

##### `menu > name`
The `name` attribute under the `menu` frontmatter determines the text used in each page's link in the site navigation.
It should be short and assume the context of its parent if it has one.

### Article headings
Use only h2-h6 headings in markdown content.
h1 headings act as the page title and are populated automatically from the `title` frontmatter.
h2-h6 headings act as section headings.

### Notes & Warnings
Shortcodes are available for formatting notes and warnings in each article:

```md
{{% note %}}
Insert note markdown content here.
{{% /note %}}

{{% warn %}}
Insert warning markdown content here.
{{% /warn %}}
```

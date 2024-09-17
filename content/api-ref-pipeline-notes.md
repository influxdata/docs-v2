# API reference pipeline with Hugo

- Hugo can render the following content formats as page content:
  Markdown, HTML, Emacs Org Mode, AsciiDoc, Pandoc, or reStructuredText.

- Front matter at the top of each content file is metadata that:

  - Describes the content
  - Augments the content
  - Establishes relationships with other content
  - Controls the published structure of your site
  - Determines template selection

1. Create a content type (folder) or assign a `type` property for API reference (OpenAPI) paths. For example, if the page structure is `content/influxdb/v2/api/v2/[OpenAPI path]`, then add `type: api_path` to the frontmatter and, if necessary, specify a layout: `layout: api_path`.
1. Store each product's OpenAPI spec files in YAML format inside a "namespaced" (to avoid collisions) directory structure in `/data`.
1. For each product.path, generate a page with all path metadata in the frontmatter. See [`.Site.Data`](https://gohugo.io/methods/site/data/)
2. Create a template to render the path
3. Create additional templates that process page data for nav, filtering, links, code samples, etc.



## Useful functions 

- [`data.GetJSON`](https://gohugo.io/functions/data/getjson/): Returns a JSON object from a local or remote JSON file, or an error if the file does not exist.
- [`resources.GetRemote URL`](https://gohugo.io/functions/resources/getremote/): fetches and caches remote resources (images, js, etc.)
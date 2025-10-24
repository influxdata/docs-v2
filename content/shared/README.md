# Shared content

This section is for content shared across multiple products and versions.
The `/shared/_index.md` frontmatter marks the `/shared` directory (`/content/shared`) and its
children as draft so they don't get rendered independently when the site is built.
The content of each shared document is included and rendered in pages that reference the
file as a `source` in their frontmatter.

## Use shared content

1. Create a new folder for the content in the `/content/shared/` directory.
2. Copy the markdown files into the new folder.
3. Remove any frontmatter from the markdown files in the shared directory. If the first line starts with a shortcode, add an HTML comment before the first line, otherwise Hugo will err.
4. In each of the files that use the shared content, add a source to the frontmatter that points to the shared markdown file—for example:

   ```markdown
   source: /shared/influxql-v3-reference/regular-expressions.md
   ```

5. In the doc body, remove the shared Markdown text and add a comment that points to the shared file, in case someone happens upon the page in the repo--for example, in `/content/3/core/reference/influxql/regular-expressions.md`, add the following:

<!-- 
//SOURCE - /content/shared/influxql-v3-reference/regular-expressions.md
-->

`//SOURCE` is a comment anchor (recognized by the Comment Anchors editor extension)
to make the file path clickable.

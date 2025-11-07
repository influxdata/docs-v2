/**
 * Lambda@Edge Function for On-Demand Markdown Generation
 *
 * Converts HTML pages from S3 to Markdown format when .md files are requested
 * Supports both single pages (index.md) and section aggregation (index.section.md)
 *
 * CloudFront Event Type: Origin Request
 * Triggers for: *.md file requests
 */

const { fetchHtmlFromS3, listChildPages } = require('./lib/s3-utils.js');
const {
  convertToMarkdown,
  convertSectionToMarkdown,
} = require('./scripts/lib/markdown-converter.js');

/**
 * Lambda@Edge handler
 * @param {Object} event - CloudFront origin request event
 * @returns {Object} CloudFront response object
 */
exports.handler = async (event) => {
  const request = event.Records[0].cf.request;
  const uri = request.uri;

  // Only process .md requests
  if (!uri.endsWith('.md')) {
    return request; // Pass through to S3
  }

  console.log(`Processing markdown request: ${uri}`);

  try {
    // Determine request type and construct S3 paths
    const isSectionRequest = uri.endsWith('.section.md');
    const urlPath = uri.replace(/index\.(section\.)?md$/, '');

    let htmlPath;
    if (isSectionRequest) {
      // Section aggregation: /path/index.section.md -> /path/index.html
      htmlPath = uri.replace(/index\.section\.md$/, 'index.html');
    } else {
      // Single page: /path/index.md -> /path/index.html
      htmlPath = uri.replace(/index\.md$/, 'index.html');
    }

    console.log(`Fetching HTML from: ${htmlPath}`);
    console.log(`URL path for frontmatter: ${urlPath}`);

    // Fetch main HTML content
    const htmlContent = await fetchHtmlFromS3(htmlPath);

    let markdown;

    if (isSectionRequest) {
      // Section aggregation: fetch child pages too
      console.log('Processing section aggregation...');

      const sectionDir = htmlPath.replace(/index\.html$/, '');
      const childPaths = await listChildPages(sectionDir);

      console.log(`Found ${childPaths.length} child pages`);

      // Fetch HTML content for each child page
      const childHtmls = [];
      for (const childPath of childPaths) {
        try {
          const childHtml = await fetchHtmlFromS3(childPath);
          const childUrl = '/' + childPath.replace(/\/index\.html$/, '/');

          childHtmls.push({
            html: childHtml,
            url: childUrl,
          });
        } catch (error) {
          console.warn(`Skipping child page ${childPath}:`, error.message);
        }
      }

      // Convert section with children to markdown
      markdown = await convertSectionToMarkdown(
        htmlContent,
        urlPath,
        childHtmls
      );
    } else {
      // Single page conversion
      console.log('Processing single page...');
      markdown = await convertToMarkdown(htmlContent, urlPath);
    }

    if (!markdown) {
      return {
        status: '404',
        statusDescription: 'Not Found',
        body: 'Markdown could not be generated from HTML',
        headers: {
          'content-type': [{ key: 'Content-Type', value: 'text/plain' }],
        },
      };
    }

    // Return markdown as response
    return {
      status: '200',
      statusDescription: 'OK',
      headers: {
        'content-type': [
          { key: 'Content-Type', value: 'text/markdown; charset=utf-8' },
        ],
        'cache-control': [
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
        'x-generated-by': [{ key: 'X-Generated-By', value: 'Lambda@Edge' }],
      },
      body: markdown,
    };
  } catch (error) {
    console.error('Error generating markdown:', error);

    // Return appropriate error response
    const status = error.message.includes('not found') ? '404' : '500';
    const statusDescription =
      status === '404' ? 'Not Found' : 'Internal Server Error';

    return {
      status,
      statusDescription,
      body: `Error: ${error.message}`,
      headers: {
        'content-type': [{ key: 'Content-Type', value: 'text/plain' }],
      },
    };
  }
};

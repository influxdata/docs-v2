/**
 * S3 Utilities for Lambda@Edge
 *
 * Helper functions for fetching HTML content from S3
 */

const {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

// S3 bucket configuration
// Try environment variable first (works for testing), then config file
let BUCKET_NAME = process.env.S3_BUCKET;

if (!BUCKET_NAME) {
  try {
    const config = require('../config.json');
    BUCKET_NAME = config.s3Bucket;
  } catch (err) {
    throw new Error(
      'S3_BUCKET must be set via environment variable or config.json'
    );
  }
}

// Configure S3 client with proper region handling
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  // Follow bucket region redirects automatically
  followRegionRedirects: true,
});

/**
 * Fetch HTML content from S3
 * @param {string} path - S3 object key (e.g., 'influxdb3/core/index.html')
 * @returns {Promise<string>} HTML content
 */
async function fetchHtmlFromS3(path) {
  // Remove leading slash if present
  const key = path.startsWith('/') ? path.substring(1) : path;

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    const htmlContent = await streamToString(response.Body);
    return htmlContent;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      throw new Error(`HTML file not found: ${key}`);
    }
    throw error;
  }
}

/**
 * List child directories in a section (for section aggregation)
 * @param {string} sectionPath - Path to section (e.g., 'influxdb3/core/query-data/execute-queries/')
 * @returns {Promise<Array>} List of child page paths
 */
async function listChildPages(sectionPath) {
  // Remove leading slash and ensure trailing slash
  let prefix = sectionPath.startsWith('/')
    ? sectionPath.substring(1)
    : sectionPath;
  if (!prefix.endsWith('/')) {
    prefix += '/';
  }

  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: prefix,
      Delimiter: '/',
    });

    const response = await s3Client.send(command);
    const childPages = [];

    // Get all subdirectories (CommonPrefixes)
    if (response.CommonPrefixes) {
      for (const commonPrefix of response.CommonPrefixes) {
        const childPrefix = commonPrefix.Prefix;
        // Check if this directory has an index.html
        const indexPath = `${childPrefix}index.html`;

        try {
          await s3Client.send(
            new GetObjectCommand({
              Bucket: BUCKET_NAME,
              Key: indexPath,
            })
          );

          // If index.html exists, add this as a child page
          childPages.push(indexPath);
        } catch (error) {
          // Skip directories without index.html
        }
      }
    }

    return childPages;
  } catch (error) {
    console.error(`Error listing child pages for ${sectionPath}:`, error);
    return [];
  }
}

/**
 * Convert stream to string
 * @param {Stream} stream - Readable stream from S3
 * @returns {Promise<string>} String content
 */
async function streamToString(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

module.exports = {
  fetchHtmlFromS3,
  listChildPages,
};

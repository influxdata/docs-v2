/**
 * Preview Comment Manager
 * Creates and updates sticky PR comments for preview status.
 *
 * Usage: Called from GitHub Actions via actions/github-script
 */

const COMMENT_MARKER = '<!-- pr-preview-comment -->';

/**
 * Generate preview comment body
 * @param {Object} options - Comment options
 * @returns {string} - Markdown comment body
 */
export function generatePreviewComment(options) {
  const {
    status,           // 'success' | 'pending' | 'failed' | 'skipped'
    previewUrl,       // Preview URL (for success)
    pages,            // Array of page URLs (for success)
    buildTime,        // Build duration string (for success)
    errorMessage,     // Error message (for failed)
    skipReason,       // Skip reason (for skipped)
    needsInput,       // Boolean (for pending)
    prNumber,
  } = options;

  const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0] + ' UTC';

  let body = `${COMMENT_MARKER}\n## PR Preview\n\n`;

  switch (status) {
    case 'success':
      body += `| Status | Details |\n`;
      body += `|--------|----------|\n`;
      body += `| **Preview** | [View preview](${previewUrl}) |\n`;
      body += `| **Pages** | ${pages.length} page(s) deployed |\n`;
      if (buildTime) {
        body += `| **Build time** | ${buildTime} |\n`;
      }
      body += `| **Last updated** | ${timestamp} |\n\n`;

      if (pages.length > 0) {
        body += `<details>\n<summary>Pages included in this preview</summary>\n\n`;
        const displayPages = pages.slice(0, 20);
        displayPages.forEach(page => {
          body += `- \`${page}\`\n`;
        });
        if (pages.length > 20) {
          body += `- ... and ${pages.length - 20} more\n`;
        }
        body += `\n</details>\n\n`;
      }
      body += `---\n<sub>Preview auto-deploys on push. Will be cleaned up when PR closes.</sub>`;
      break;

    case 'pending':
      if (needsInput) {
        body += `### Preview pages needed\n\n`;
        body += `This PR changes layout/asset files but doesn't specify which pages to preview.\n\n`;
        body += `**To generate a preview**, add documentation URLs to your PR description, for example:\n`;
        body += `\`\`\`\nPlease review:\n- https://docs.influxdata.com/influxdb3/core/get-started/\n- /telegraf/v1/plugins/\n\`\`\`\n\n`;
        body += `Then re-run the workflow or push a new commit.\n\n`;
        body += `---\n<sub>Last checked: ${timestamp}</sub>`;
      } else {
        body += `⏳ **Preview building...**\n\n`;
        body += `---\n<sub>Started: ${timestamp}</sub>`;
      }
      break;

    case 'failed':
      body += `### Preview failed\n\n`;
      body += `The preview build encountered an error:\n\n`;
      body += `\`\`\`\n${errorMessage || 'Unknown error'}\n\`\`\`\n\n`;
      body += `[View workflow logs](https://github.com/influxdata/docs-v2/actions)\n\n`;
      body += `---\n<sub>Failed: ${timestamp}</sub>`;
      break;

    case 'skipped':
      body += `### Preview skipped\n\n`;
      body += `${skipReason || 'No previewable changes detected.'}\n\n`;
      body += `---\n<sub>Checked: ${timestamp}</sub>`;
      break;
  }

  return body;
}

/**
 * Find existing preview comment on PR
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @returns {Object|null} - Existing comment or null
 */
export async function findExistingComment(github, context) {
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  return comments.find(comment => comment.body.includes(COMMENT_MARKER));
}

/**
 * Create or update preview comment
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 * @param {Object} options - Comment options
 */
export async function upsertPreviewComment(github, context, options) {
  const body = generatePreviewComment(options);
  const existingComment = await findExistingComment(github, context);

  if (existingComment) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingComment.id,
      body,
    });
    console.log(`Updated existing comment: ${existingComment.id}`);
  } else {
    const { data: newComment } = await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body,
    });
    console.log(`Created new comment: ${newComment.id}`);
  }
}

/**
 * Delete preview comment (used on PR close)
 * @param {Object} github - GitHub API client
 * @param {Object} context - GitHub Actions context
 */
export async function deletePreviewComment(github, context) {
  const existingComment = await findExistingComment(github, context);

  if (existingComment) {
    await github.rest.issues.deleteComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: existingComment.id,
    });
    console.log(`Deleted comment: ${existingComment.id}`);
  }
}

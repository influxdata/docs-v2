/**
 * Preview Comment Manager
 * Creates and updates sticky PR comments for preview status.
 *
 * Usage: Called from GitHub Actions via actions/github-script
 */

const COMMENT_MARKER = '<!-- pr-preview-comment -->';

/**
 * Sanitize text for safe display in code blocks
 * Prevents XSS by escaping code fences and limiting length
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum length (default: 1000)
 * @returns {string} - Sanitized text
 */
function sanitizeForCodeBlock(text, maxLength = 1000) {
  if (!text) return 'Unknown error';
  return text.replace(/```/g, '` `` `').substring(0, maxLength);
}

/**
 * Generate preview comment body
 * @param {Object} options - Comment options
 * @param {string} options.status - Status: 'success' | 'pending' | 'failed' | 'skipped'
 * @param {string} [options.previewUrl] - Preview base URL (for success)
 * @param {string[]} [options.pages] - Array of changed page URLs (for success; deep links only — the full site deploys regardless)
 * @param {string} [options.buildTime] - Build duration string (for success)
 * @param {string} [options.errorMessage] - Error message (for failed)
 * @param {string} [options.skipReason] - Skip reason (for skipped)
 * @returns {string} - Markdown comment body
 */
export function generatePreviewComment(options) {
  const {
    status, // 'success' | 'pending' | 'failed' | 'skipped'
    previewUrl, // Preview base URL (for success)
    pages, // Array of changed page URLs (for success)
    buildTime, // Build duration string (for success)
    errorMessage, // Error message (for failed)
    skipReason, // Skip reason (for skipped)
  } = options;

  const timestamp =
    new Date().toISOString().replace('T', ' ').split('.')[0] + ' UTC';

  // Agent persona header for clear identification
  let body = `${COMMENT_MARKER}\n## 📦 PR Preview — Preview Bot\n\n`;

  switch (status) {
    case 'success':
      body += `| Status | Details |\n`;
      body += `|--------|----------|\n`;
      body += `| **Result** | ✅ DEPLOYED (full site) |\n`;
      body += `| **Preview** | [View preview](${previewUrl}) |\n`;
      if (buildTime) {
        body += `| **Build time** | ${buildTime} |\n`;
      }
      body += `| **Last updated** | ${timestamp} |\n\n`;

      if (pages && pages.length > 0) {
        body += `<details>\n<summary>Changed pages (${pages.length})</summary>\n\n`;
        const displayPages = pages.slice(0, 20);
        displayPages.forEach((page) => {
          const trimmedBase = previewUrl.replace(/\/$/, '');
          const trimmedPage = page.replace(/^\//, '');
          const safeLabel = page.replace(/`/g, '\\`');
          body += `- [\`${safeLabel}\`](${trimmedBase}/${trimmedPage})\n`;
        });
        if (pages.length > 20) {
          body += `- ... and ${pages.length - 20} more\n`;
        }
        body += `\n</details>\n\n`;
      }
      body += `---\n<sub>Preview auto-deploys on push. Will be cleaned up when PR closes.</sub>`;
      break;

    case 'pending':
      body += `| Status | Details |\n`;
      body += `|--------|----------|\n`;
      body += `| **Result** | ⏳ BUILDING |\n`;
      body += `| **Started** | ${timestamp} |\n\n`;
      body += `Preview is building...`;
      break;

    case 'failed':
      body += `| Status | Details |\n`;
      body += `|--------|----------|\n`;
      body += `| **Result** | ❌ FAILED |\n`;
      body += `| **Failed** | ${timestamp} |\n\n`;
      body += `### Build Error\n\n`;
      body += `\`\`\`\n${sanitizeForCodeBlock(errorMessage)}\n\`\`\`\n\n`;
      body += `[View workflow logs](https://github.com/influxdata/docs-v2/actions)`;
      break;

    case 'skipped':
      // Skip reasons are controlled strings from the workflow, plain text sanitization is sufficient
      const safeSkipReason = (
        skipReason || 'No previewable changes detected.'
      ).substring(0, 200);
      body += `| Status | Details |\n`;
      body += `|--------|----------|\n`;
      body += `| **Result** | ⏭️ SKIPPED |\n`;
      body += `| **Reason** | ${safeSkipReason} |\n`;
      body += `| **Checked** | ${timestamp} |`;
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

  return comments.find((comment) => comment.body.includes(COMMENT_MARKER));
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

import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkFrontmatter from 'remark-frontmatter';
import remarkFrontmatterSchema from 'remark-lint-frontmatter-schema';
import remarkNoShellDollars from 'remark-lint-no-shell-dollars';
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references';
import remarkToc from 'remark-toc';

const remarkConfig = {
  settings: {
    bullet: '-',
  },
  plugins: [
    remarkPresetLintConsistent,
    remarkPresetLintRecommended,
    remarkPresetLintMarkdownStyleGuide,
    remarkFrontmatter,
    remarkFrontmatterSchema,
    remarkNoShellDollars,
    // Override no-undefined-references to allow GitHub Alerts syntax
    // This prevents lint warnings for [!Note], [!Tip], etc. in blockquotes
    [
      remarkLintNoUndefinedReferences,
      {
        allow: ['!Note', '!Tip', '!Important', '!Warning', '!Caution'],
      },
    ],
    // Generate a table of contents in `## Contents`
    [remarkToc, { heading: '' }],
  ],
};

export default remarkConfig;

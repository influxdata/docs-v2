import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkFrontmatter from 'remark-frontmatter';
import remarkFrontmatterSchema from 'remark-lint-frontmatter-schema';
import remarkNoShellDollars from 'remark-lint-no-shell-dollars';
import remarkToc from 'remark-toc';

const remarkConfig = {
  settings: {
    bullet: '-',
    plugins: [
      remarkPresetLintConsistent,
      remarkPresetLintRecommended,
      remarkPresetLintMarkdownStyleGuide,
      remarkFrontmatter,
      remarkFrontmatterSchema,
      remarkNoShellDollars,
      // Generate a table of contents in `## Contents`
      [remarkToc, { heading: '' }],
    ],
  },
};

export default remarkConfig;
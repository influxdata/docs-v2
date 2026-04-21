/**
 * Highlights Telegraf Controller dynamic values in code blocks.
 *
 * Wraps three pattern types in styled <span> elements:
 *   - Parameters:             &{name}  or  &{name:default}
 *   - Environment variables:  ${VAR_NAME}
 *   - Secrets:                @{store:secret_name}
 *
 * Applied to code blocks with class="tc-dynamic-values" via
 * the data-component="tc-dynamic-values" attribute set by
 * the render-codeblock hook.
 */

const PATTERNS = [
  { regex: /&\{[^}]+\}/g, className: 'param' },
  { regex: /\$\{[^}]+\}/g, className: 'env' },
  { regex: /@\{[^:]+:[^}]+\}/g, className: 'secret' },
];

/**
 * Walk all text nodes inside the given element and wrap matches
 * in <span class="tc-dynamic-value {type}"> elements.
 */
function highlightDynamicValues(codeEl) {
  const walker = document.createTreeWalker(codeEl, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  for (const node of textNodes) {
    const text = node.textContent;
    let hasMatch = false;

    for (const { regex } of PATTERNS) {
      regex.lastIndex = 0;
      if (regex.test(text)) {
        hasMatch = true;
        break;
      }
    }

    if (!hasMatch) continue;

    const fragment = document.createDocumentFragment();
    let remaining = text;

    while (remaining.length > 0) {
      let earliestMatch = null;
      let earliestIndex = remaining.length;
      let matchedPattern = null;

      for (const pattern of PATTERNS) {
        pattern.regex.lastIndex = 0;
        const match = pattern.regex.exec(remaining);
        if (match && match.index < earliestIndex) {
          earliestMatch = match;
          earliestIndex = match.index;
          matchedPattern = pattern;
        }
      }

      if (!earliestMatch) {
        fragment.appendChild(document.createTextNode(remaining));
        break;
      }

      if (earliestIndex > 0) {
        fragment.appendChild(
          document.createTextNode(remaining.slice(0, earliestIndex))
        );
      }

      const span = document.createElement('span');
      span.className = `tc-dynamic-value ${matchedPattern.className}`;
      span.textContent = earliestMatch[0];
      fragment.appendChild(span);

      remaining = remaining.slice(earliestIndex + earliestMatch[0].length);
    }

    node.parentNode.replaceChild(fragment, node);
  }
}

export default function TcDynamicValues({ component }) {
  const codeEl = component.querySelector('code');
  if (codeEl) {
    highlightDynamicValues(codeEl);
  }
}

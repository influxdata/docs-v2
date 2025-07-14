import $ from 'jquery';
import { context } from './page-context.js';

function initialize() {
  var codeBlockSelector = '.article--content pre';
  var $codeBlocks = $(codeBlockSelector);

  var appendHTML = `
<div class="code-controls">
  <span class="code-controls-toggle"><span class='cf-icon More'></span></span>
  <ul class="code-control-options">
    <li class='copy-code'><span class='cf-icon Duplicate_New'></span> <span class="message">Copy</span></li>
    <li class='fullscreen-toggle'><span class='cf-icon ExpandB'></span> Fill window</li>
  </ul>
</div>
`;

  // Wrap all codeblocks with a new 'codeblock' div
  $codeBlocks.each(function () {
    $(this).wrap("<div class='codeblock'></div>");
  });

  // Append code controls to all codeblock divs
  $('.codeblock').append(appendHTML);

  //////////////////////////// CODE CONTROLS TOGGLING ////////////////////////////

  // Click outside of the code-controls to close them
  $(document).click(function () {
    $('.code-controls').removeClass('open');
  });

  // Click the code controls toggle to open code controls
  $('.code-controls-toggle').click(function () {
    $(this).parent('.code-controls').toggleClass('open');
  });

  // Stop event propagation for clicks inside of the code-controls div
  $('.code-controls').click(function (e) {
    e.stopPropagation();
  });

  /////////////////////////////// COPY TO CLIPBOARD //////////////////////////////

  // Update button text during lifecycles
  function updateText(element, currentText, newText) {
    let inner = element[0].innerHTML;
    inner = inner.replace(currentText, newText);

    element[0].innerHTML = inner;
  }

  // Trigger copy success state lifecycle
  function copyLifeCycle(element, state) {
    let stateData =
      state === 'success'
        ? { state: 'success', message: 'Copied!' }
        : { state: 'failed', message: 'Copy failed!' };

    updateText(element, 'Copy', stateData.message);
    element.addClass(stateData.state);

    setTimeout(function () {
      updateText(element, stateData.message, 'Copy');
      element.removeClass(stateData.state);
    }, 2500);
  }

  // Trigger copy failure state lifecycle

  $('.copy-code').click(function () {
    let codeElement = $(this)
      .closest('.code-controls')
      .prevAll('pre:has(code)')[0];

    let text = codeElement.innerText;

    // Extract additional code block information
    const codeBlockInfo = extractCodeBlockInfo(codeElement);

    // Add Google Analytics event tracking
    const currentUrl = new URL(window.location.href);

    // Determine which tracking parameter to add based on product context
    switch (context) {
      case 'cloud':
        currentUrl.searchParams.set('dl', 'cloud');
        break;
      case 'core':
        /** Track using the same value used by www.influxdata.com pages */
        currentUrl.searchParams.set('dl', 'oss3');
        break;
      case 'enterprise':
        /** Track using the same value used by www.influxdata.com pages */
        currentUrl.searchParams.set('dl', 'enterprise');
        break;
      case 'serverless':
        currentUrl.searchParams.set('dl', 'serverless');
        break;
      case 'dedicated':
        currentUrl.searchParams.set('dl', 'dedicated');
        break;
      case 'clustered':
        currentUrl.searchParams.set('dl', 'clustered');
        break;
      case 'oss/enterprise':
        currentUrl.searchParams.set('dl', 'oss');
        break;
      case 'other':
      default:
        // No tracking parameter for other/unknown products
        break;
    }

    // Add code block specific tracking parameters
    if (codeBlockInfo.language) {
      currentUrl.searchParams.set('code_lang', codeBlockInfo.language);
    }
    if (codeBlockInfo.lineCount) {
      currentUrl.searchParams.set('code_lines', codeBlockInfo.lineCount);
    }
    if (codeBlockInfo.hasPlaceholders) {
      currentUrl.searchParams.set('has_placeholders', 'true');
    }
    if (codeBlockInfo.blockType) {
      currentUrl.searchParams.set('code_type', codeBlockInfo.blockType);
    }
    if (codeBlockInfo.sectionTitle) {
      currentUrl.searchParams.set(
        'section',
        encodeURIComponent(codeBlockInfo.sectionTitle)
      );
    }
    if (codeBlockInfo.firstLine) {
      currentUrl.searchParams.set(
        'first_line',
        encodeURIComponent(codeBlockInfo.firstLine.substring(0, 100))
      );
    }

    // Update browser history without triggering page reload
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', currentUrl.toString());
    }

    // Send custom Google Analytics event if gtag is available
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'code_copy', {
        language: codeBlockInfo.language,
        line_count: codeBlockInfo.lineCount,
        has_placeholders: codeBlockInfo.hasPlaceholders,
        dl: codeBlockInfo.dl || null,
        section_title: codeBlockInfo.sectionTitle,
        first_line: codeBlockInfo.firstLine
          ? codeBlockInfo.firstLine.substring(0, 100)
          : null,
        product: context,
      });
    }

    const copyContent = async () => {
      try {
        await navigator.clipboard.writeText(text);
        copyLifeCycle($(this), 'success');
      } catch {
        copyLifeCycle($(this), 'failed');
      }
    };

    copyContent();
  });

  /**
   * Extract contextual information about a code block
   * @param {HTMLElement} codeElement - The code block element
   * @returns {Object} Information about the code block
   */
  function extractCodeBlockInfo(codeElement) {
    const codeTag = codeElement.querySelector('code');
    const info = {
      language: null,
      lineCount: 0,
      hasPlaceholders: false,
      blockType: 'code',
      dl: null, // Download script type
      sectionTitle: null,
      firstLine: null,
    };

    // Extract language from class attribute
    if (codeTag && codeTag.className) {
      const langMatch = codeTag.className.match(
        /language-(\w+)|hljs-(\w+)|(\w+)/
      );
      if (langMatch) {
        info.language = langMatch[1] || langMatch[2] || langMatch[3];
      }
    }

    // Count lines
    const text = codeElement.innerText || '';
    const lines = text.split('\n');
    info.lineCount = lines.length;

    // Get first non-empty line
    info.firstLine = lines.find((line) => line.trim() !== '') || null;

    // Check for placeholders (common patterns)
    info.hasPlaceholders =
      /\b[A-Z_]{2,}\b|\{\{[^}]+\}\}|\$\{[^}]+\}|<[^>]+>/.test(text);

    // Determine if this is a download script
    if (text.includes('https://www.influxdata.com/d/install_influxdb3.sh')) {
      if (text.includes('install_influxdb3.sh enterprise')) {
        info.dl = 'enterprise';
      } else {
        info.dl = 'oss3';
      }
    } else if (text.includes('docker pull influxdb:3-enterprise')) {
      info.dl = 'enterprise';
    } else if (text.includes('docker pull influxdb:3-core')) {
      info.dl = 'oss3';
    }

    // Find nearest section heading
    let element = codeElement;
    while (element && element !== document.body) {
      element = element.previousElementSibling || element.parentElement;
      if (element && element.tagName && /^H[1-6]$/.test(element.tagName)) {
        info.sectionTitle = element.textContent.trim();
        break;
      }
    }

    return info;
  }

  /////////////////////////////// FULL WINDOW CODE ///////////////////////////////

  /*
On click, open the fullscreen code modal and append a clone of the selected codeblock.
Disable scrolling on the body.
Disable user selection on everything but the fullscreen codeblock.
*/
  $('.fullscreen-toggle').click(function () {
    var code = $(this)
      .closest('.code-controls')
      .prevAll('pre:has(code)')
      .clone();

    $('#fullscreen-code-placeholder').replaceWith(code[0]);
    $('body').css('overflow', 'hidden');
    $('body > div:not(.fullscreen-code)').css('user-select', 'none');
    $('.fullscreen-code').fadeIn();
  });

  /*
On click, close the fullscreen code block.
Reenable scrolling on the body.
Reenable user selection on everything.
Close the modal and replace the code block with the placeholder element.
*/
  $('.fullscreen-close').click(function () {
    $('body').css('overflow', 'auto');
    $('body > div:not(.fullscreen-code)').css('user-select', '');
    $('.fullscreen-code').fadeOut();
    $('.fullscreen-code pre').replaceWith(
      '<div id="fullscreen-code-placeholder"></div>'
    );
  });
}

export { initialize };

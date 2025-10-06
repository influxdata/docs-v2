/*
////////////////////////////////////////////////////////////////////////////////
///////////////////////// INFLUXDB URL PREFERENCE /////////////////////////////
////////////////////////////////////////////////////////////////////////////////
*/
import {
  DEFAULT_STORAGE_URLS,
  getPreference,
  setPreference,
  setInfluxDBUrls,
  removeInfluxDBUrl,
  getInfluxDBUrl,
  getInfluxDBUrls,
} from './services/local-storage.js';
import $ from 'jquery';
import { context as PRODUCT_CONTEXT, referrerHost } from './page-context.js';
import { influxdbUrls } from './services/influxdb-urls.js';
import { delay } from './helpers.js';
import { toggleModal } from './modals.js';

let CLOUD_URLS = [];
if (influxdbUrls?.cloud) {
  CLOUD_URLS = Object.values(influxdbUrls.cloud.providers).flatMap((provider) =>
    provider.regions?.map((region) => region.url)
  );
}
export { CLOUD_URLS };

export function InfluxDBUrl() {
  const UNIQUE_URL_PRODUCTS = ['dedicated', 'clustered'];
  const IS_UNIQUE_URL_PRODUCT = UNIQUE_URL_PRODUCTS.includes(PRODUCT_CONTEXT);

  // Add actual cloud URLs as needed
  const elementSelector = '.article--content pre:not(.preserve)';

  ///////////////////// Stored preference management ///////////////////////
  // Retrieve the user's InfluxDB preference (cloud or oss) from the
  // influxdb_pref local storage key. Default is cloud.
  function getURLPreference() {
    return getPreference('influxdb_url');
  }

  // Set the user's selected InfluxDB preference (cloud or oss)
  function setURLPreference(preference) {
    setPreference('influxdb_url', preference);
  }

  /*
  influxdata_docs_urls local storage object keys: 

  - oss
  - cloud
  - core
  - enterprise
  - dedicated
  - clustered
  - prev_oss
  - prev_cloud
  - prev_core
  - prev_enterprise
  - prev_dedicated
  - prev_clustered
  - custom
*/

  // Store URLs in the urls local storage object
  function storeUrl(context, newUrl, prevUrl) {
    let urlsObj = {};
    urlsObj['prev_' + context] = prevUrl;
    urlsObj[context] = newUrl;

    setInfluxDBUrls(urlsObj);
  }

  // Store custom URL in the url local storage object
  // Used to populate the custom URL field
  function storeCustomUrl(customUrl) {
    setInfluxDBUrls({ custom: customUrl });
    $('input#custom[type=radio]').val(customUrl);
  }

  // Set a URL in the urls local storage object to an empty string
  // Used to clear the form when custom url input is left empty
  function removeCustomUrl() {
    removeInfluxDBUrl('custom');
  }

  // Store a product URL in the urls local storage object
  // Used to populate the custom URL field
  function storeProductUrl(product, productUrl) {
    let urlsObj = {};
    urlsObj[product] = productUrl;

    setInfluxDBUrls(urlsObj);
    $(`input#${product}-url-field`).val(productUrl);
  }

  // Set a product URL in the urls local storage object to an empty string
  // Used to clear the form when dedicated url input is left empty
  function removeProductUrl(product) {
    removeInfluxDBUrl(product);
  }

  //////////////////////////////////////////////////////////////////////////////
  /////////////////////// InfluxDB URL utility functions ///////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Preserve URLs in codeblocks that come just after or are inside a div
  // with the class, .keep-url
  function addPreserve() {
    $('.keep-url').each(function () {
      // For code blocks with no syntax highlighting
      $(this).next('pre').addClass('preserve');
      // For code blocks with no syntax highlighting inside of a link
      // (API endpoint blocks)
      $(this).next('a').find('pre').addClass('preserve');
      // For code blocks with syntax highlighting
      $(this).next('.highlight').find('pre').addClass('preserve');
      // For code blocks inside .keep-url div
      // Special use case for codeblocks generated from yaml data / frontmatter
      $(this).find('pre').addClass('preserve');
    });
  }

  // Retrieve the currently selected URLs from the urls local storage object.
  function getUrls() {
    const { cloud, oss, core, enterprise, serverless, dedicated, clustered } =
      getInfluxDBUrls();
    return { oss, cloud, core, enterprise, serverless, dedicated, clustered };
  }

  // Retrieve the previously selected URLs from the urls local storage
  // object. This updates URLs when switching between browser tabs.
  function getPrevUrls() {
    const {
      prev_cloud: cloud,
      prev_oss: oss,
      prev_core: core,
      prev_enterprise: enterprise,
      prev_serverless: serverless,
      prev_dedicated: dedicated,
      prev_clustered: clustered,
    } = getInfluxDBUrls();
    return { oss, cloud, core, enterprise, serverless, dedicated, clustered };
  }

  // Iterate through code blocks and update InfluxDB urls
  function updateUrls(prevUrls, newUrls) {
    var prevUrlsParsed = {
      oss: {},
      cloud: {},
      core: {},
      enterprise: {},
      serverless: {},
      dedicated: {},
      clustered: {},
    };

    var newUrlsParsed = {
      oss: {},
      cloud: {},
      core: {},
      enterprise: {},
      serverless: {},
      dedicated: {},
      clustered: {},
    };

    Object.keys(prevUrls).forEach(function (k) {
      try {
        prevUrlsParsed[k] = new URL(prevUrls[k]);
      } catch {
        prevUrlsParsed[k] = { origin: prevUrls[k], host: prevUrls[k] };
      }
    });

    Object.keys(newUrls).forEach(function (k) {
      try {
        newUrlsParsed[k] = new URL(newUrls[k]);
      } catch {
        newUrlsParsed[k] = { origin: newUrls[k], host: newUrls[k] };
      }
    });

    /**
     * Match and replace <prev> host with <new> host
     * then replace <prev> URL with <new> URL.
     **/
    var ossReplacements = [
      { replace: prevUrlsParsed.cloud, with: newUrlsParsed.cloud },
      { replace: prevUrlsParsed.oss, with: newUrlsParsed.oss },
    ];
    var cloudReplacements = [
      { replace: prevUrlsParsed.cloud, with: newUrlsParsed.cloud },
      { replace: prevUrlsParsed.oss, with: newUrlsParsed.cloud },
    ];
    var serverlessReplacements = [
      { replace: prevUrlsParsed.serverless, with: newUrlsParsed.serverless },
      { replace: prevUrlsParsed.oss, with: newUrlsParsed.serverless },
    ];
    var coreReplacements = [
      { replace: prevUrlsParsed.core, with: newUrlsParsed.core },
    ];
    var enterpriseReplacements = [
      { replace: prevUrlsParsed.enterprise, with: newUrlsParsed.enterprise },
    ];
    var dedicatedReplacements = [
      { replace: prevUrlsParsed.dedicated, with: newUrlsParsed.dedicated },
    ];
    var clusteredReplacements = [
      { replace: prevUrlsParsed.clustered, with: newUrlsParsed.clustered },
    ];

    var replacements;
    switch (PRODUCT_CONTEXT) {
      case 'cloud':
        replacements = cloudReplacements;
        break;
      case 'core':
        replacements = coreReplacements;
        break;
      case 'enterprise':
        replacements = enterpriseReplacements;
        break;
      case 'serverless':
        replacements = serverlessReplacements;
        break;
      case 'dedicated':
        replacements = dedicatedReplacements;
        break;
      case 'clustered':
        replacements = clusteredReplacements;
        break;
      case 'oss/enterprise':
        replacements = ossReplacements;
        break;
      default:
        if (getURLPreference() === 'cloud') {
          replacements = cloudReplacements;
        } else {
          replacements = ossReplacements;
        }
        break;
    }
    replacements.forEach(function (o) {
      if (o.replace.origin != o.with.origin) {
        var fuzzyOrigin = new RegExp(
          o.replace.origin + '(:(^443)|[0-9]+)?',
          'g'
        );
        $(elementSelector).each(function () {
          $(this).html(
            $(this)
              .html()
              .replace(fuzzyOrigin, function (m) {
                return o.with.origin || m;
              })
          );
        });
      }
    });

    function replaceWholename(startStr, endStr, replacement) {
      var startsWithSeparator = new RegExp('[/.]');
      var endsWithSeparator = new RegExp('[-.:]');
      if (
        !startsWithSeparator.test(startStr) &&
        !endsWithSeparator.test(endStr)
      ) {
        var newHost = startStr + replacement + endStr;
        return newHost;
      }
    }

    replacements
      .map(function (o) {
        return { replace: o.replace.host, with: o.with.host };
      })
      .forEach(function (o) {
        if (o.replace != o.with) {
          var fuzzyHost = new RegExp('(.?)' + o.replace + '(.?)', 'g');
          $(elementSelector).each(function () {
            $(this).html(
              $(this)
                .html()
                .replace(fuzzyHost, function (m, p1, p2) {
                  var r = replaceWholename(p1, p2, o.with) || m;
                  return r;
                })
            );
          });
        }
      });
  }

  // Append the URL selector button to codeblocks that contain a placeholder URL
  function appendUrlSelector(
    urls = {
      cloud: '',
      oss: '',
      core: '',
      enterprise: '',
      serverless: '',
      dedicated: '',
      clustered: '',
    }
  ) {
    const appendToUrls = Object.values(urls);

    const getBtnText = (context) => {
      const contextText = {
        'oss/enterprise': 'Change InfluxDB URL',
        cloud: 'InfluxDB Cloud Region',
        core: 'Change InfluxDB URL',
        enterprise: 'Change InfluxDB URL',
        serverless: 'InfluxDB Cloud Region',
        dedicated: 'Set Cloud Dedicated cluster URL',
        clustered: 'Set InfluxDB cluster URL',
        other: 'InfluxDB Cloud or OSS?',
      };

      return contextText[context];
    };

    // Process each code block only once
    $(elementSelector).each(function () {
      var code = $(this).html();
      var $codeBlock = $(this);

      // Check if this code block contains any of the URLs
      var containsUrl = appendToUrls.some(function (url) {
        return url && code.includes(url);
      });

      // If the code block contains at least one URL and doesn't already have a
      // URL selector button
      if (containsUrl && !$codeBlock.next('.select-url').length) {
        $codeBlock.after(
          "<div class='select-url'><a class='url-trigger' href='#'>" +
            getBtnText(PRODUCT_CONTEXT) +
            '</a></div>'
        );
      }
    });

    // Fade in all select-url elements after they've been added
    $('.select-url').fadeIn(400);
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////// Initialize InfluxDB URL interactions ////////////////////
  ////////////////////////////////////////////////////////////////////////////

  // Add the preserve tag to code blocks that shouldn't be updated
  addPreserve();
  const { cloud, oss, core, enterprise, serverless, dedicated, clustered } =
    DEFAULT_STORAGE_URLS;

  // Append URL selector buttons to code blocks
  appendUrlSelector({
    cloud,
    oss,
    core,
    enterprise,
    serverless,
    dedicated,
    clustered,
  });

  // Update URLs on load

  updateUrls(
    { cloud, oss, core, enterprise, serverless, dedicated, clustered },
    getUrls()
  );

  // Set active radio button on page load
  setRadioButtons(getUrls());

  //////////////////////////////////////////////////////////////////////////////
  ///////////////////////// Modal window interactions //////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // General modal window interactions are controlled in modals.js

  // Open the InfluxDB URL selector modal
  $('.url-trigger').click(function (e) {
    e.preventDefault();
    toggleModal('#influxdb-url-list');
  });

  // Set the selected URL radio buttons to :checked
  function setRadioButtons() {
    const currentUrls = getUrls();
    $(
      'input[name="influxdb-cloud-url"][value="' + currentUrls.cloud + '"]'
    ).prop('checked', true);
    $(
      'input[name="influxdb-serverless-url"][value="' +
        currentUrls.serverless +
        '"]'
    ).prop('checked', true);
    $('input[name="influxdb-oss-url"][value="' + currentUrls.oss + '"]').prop(
      'checked',
      true
    );
    $('input[name="influxdb-core-url"][value="' + currentUrls.core + '"]').prop(
      'checked',
      true
    );
    $(
      'input[name="influxdb-enterprise-url"][value="' +
        currentUrls.enterprise +
        '"]'
    ).prop('checked', true);
  }

  // Add checked to fake-radio if cluster is selected on page load
  if ($('ul.clusters label input').is(':checked')) {
    var group = $('ul.clusters label input:checked')
      .parent()
      .parent()
      .parent()
      .siblings();
    $('.fake-radio', group).addClass('checked');
  }

  // Select first cluster when region is clicked
  $('p.region').click(function () {
    if (!$('.fake-radio', this).hasClass('checked')) {
      $('.fake-radio', this).addClass('checked');
      $('+ ul.clusters li:first label', this).trigger('click');
    }
  });

  // Remove checked class from fake-radio when another region is selected
  $('.region-group').click(function () {
    if (!$('.fake-radio', this).hasClass('checked')) {
      $('.fake-radio', !this).removeClass('checked');
      $('.fake-radio', this).addClass('checked');
    }
  });

  // Update URLs and URL preference when selected/clicked in the modal
  $('input[name="influxdb-oss-url"]').change(function () {
    var newUrl = $(this).val();
    storeUrl('oss', newUrl, getUrls().oss);
    updateUrls(getPrevUrls(), getUrls());
    setURLPreference('oss');
  });
  $('input[name="influxdb-oss-url"]').click(function () {
    setURLPreference('oss');
  });

  $('input[name="influxdb-cloud-url"]').change(function () {
    var newUrl = $(this).val();
    storeUrl('cloud', newUrl, getUrls().cloud);
    updateUrls(getPrevUrls(), getUrls());
  });
  $('input[name="influxdb-cloud-url"]').click(function () {
    setURLPreference('cloud');
  });

  $('input[name="influxdb-core-url"]').change(function () {
    var newUrl = $(this).val();
    storeUrl('core', newUrl, getUrls().core);
    updateUrls(getPrevUrls(), getUrls());
  });

  $('input[name="influxdb-enterprise-url"]').change(function () {
    var newUrl = $(this).val();
    storeUrl('enterprise', newUrl, getUrls().enterprise);
    updateUrls(getPrevUrls(), getUrls());
  });

  $('input[name="influxdb-serverless-url"]').change(function () {
    var newUrl = $(this).val();
    storeUrl('serverless', newUrl, getUrls().serverless);
    updateUrls(getPrevUrls(), getUrls());
  });

  $('input[name="influxdb-dedicated-url"]').change(function () {
    var newUrl = $(this).val();
    storeUrl('dedicated', newUrl, getUrls().dedicated);
    updateUrls(getPrevUrls(), getUrls());
  });

  $('input[name="influxdb-clustered-url"]').change(function () {
    var newUrl = $(this).val();
    storeUrl('clustered', newUrl, getUrls().clustered);
    updateUrls(getPrevUrls(), getUrls());
  });

  // Populate the product-specific URL fields on page load
  UNIQUE_URL_PRODUCTS.forEach(function (productEl) {
    let productUrlCookie = getInfluxDBUrl(productEl);
    $(`input#${productEl}-url-field`).val(productUrlCookie);
    $(`#${productEl}-url-field`).val(productUrlCookie);
  });

  // Toggle preference tabs
  function togglePrefBtns(el) {
    const preference = el.length ? el.attr('id').replace('pref-', '') : 'cloud';
    const prefUrls = $('#' + preference + '-urls');

    el.addClass('active');
    el.siblings().removeClass('active');
    prefUrls.addClass('active').removeClass('inactive');
    prefUrls.siblings().addClass('inactive').removeClass('active');
    setURLPreference(preference);
  }

  // Select preference tab on click
  $('#pref-tabs .pref-tab').click(function () {
    togglePrefBtns($(this));
  });

  // Select preference tab from local storage
  function showPreference() {
    const preference = getPreference('influxdb_url');
    const prefTab = $('#pref-' + preference);
    togglePrefBtns(prefTab);
  }

  // Toggled preferred service on load
  showPreference();

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////// Custom URLs /////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Validate custom URLs
    /** Match 3 possible types of hosts:
     * Named host = (unreserved | pct-encoded | sub-delims)+
     * IPv6 host = \[([a-f0-9:.]+)\]
     * IPvFuture host = \[v[a-f0-9][a-z0-9\-._~%!$&'()*+,;=:]+\]
     * Port = [0-9]+
     */
    /** validDomain = (Named host | IPv6 host | IPvFuture host)(:Port)? **/
    const validDomain = new RegExp(
      `([a-z0-9\-._~%]+` +
        `|\[[a-f0-9:.]+\]` +
        `|\[v[a-f0-9][a-z0-9\-._~%!$&'()*+,;=:]+\])` +
        `(:[0-9]+)?`
    );

    if (!IS_UNIQUE_URL_PRODUCT) {
      // Validation for non-dedicated, non-clustered custom InfluxDB URLs
      const validProtocol = /^http(s?)/;
      const protocol = url.match(/http(s?):\/\//)
        ? url.match(/http(s?):\/\//)[0]
        : '';
      const domain = url.replace(protocol, '');

      // First use the regex to check for an HTTP protocol and valid domain
      // JS URL validation can't differentiate host:port string from a protocol.
      if (validProtocol.test(protocol) == false) {
        return { valid: false, error: 'Invalid protocol, use http[s]' };
      } else if (validDomain.test(domain) == false) {
        return { valid: false, error: 'Invalid domain' };
      } else {
        try {
          new URL(url);
          return { valid: true, error: '' };
        } catch (e) {
          if (e instanceof TypeError) {
            return { valid: false, error: 'Invalid URL' };
          }
        }
      }
    } else {
      // Validation for product-specific URLs
      const includesProtocol = /^.*:\/\//;
      const protocol = url.match(/^.*:\/\//) ? url.match(/^.*:\/\//)[0] : '';
      const domain = url.replace(protocol, '');

      if (url.length === 0) {
        return { valid: true, error: '' };
      } else if (includesProtocol.test(protocol) == true) {
        return { valid: false, error: 'Do not include the protocol' };
      } else if (validDomain.test(domain) == false) {
        return { valid: false, error: 'Invalid domain' };
      } else {
        return { valid: true, error: '' };
      }
    }
  }

  // Show validation errors
  function showValidationMessage(validation) {
    $('#custom-url').addClass('error');
    $('#custom-url').attr('data-message', validation.error);
  }

  // Hide validation messages and replace the message attr with empty string
  function hideValidationMessage() {
    $('#custom-url').removeClass('error').attr('data-message', '');
  }

  // Set the custom URL local storage object and apply the change
  // If the custom URL field is empty, it defaults to the context default
  function applyCustomUrl() {
    var custUrl = $('#custom-url-field').val();
    let urlValidation = validateUrl(custUrl);
    if (custUrl.length > 0) {
      if (urlValidation.valid) {
        hideValidationMessage();
        storeCustomUrl(custUrl);
        storeUrl(PRODUCT_CONTEXT, custUrl, getUrls()[PRODUCT_CONTEXT]);
        updateUrls(getPrevUrls(), getUrls());
      } else {
        showValidationMessage(urlValidation);
      }
    } else {
      removeCustomUrl();
      hideValidationMessage();
      $(
        `input[name="influxdb-${PRODUCT_CONTEXT}-url"][value="` +
          DEFAULT_STORAGE_URLS[PRODUCT_CONTEXT] +
          '"]'
      ).trigger('click');
    }
  }

  // Set the product URL local storage object and apply the change
  // If the product URL field is empty, it defaults to the product default
  function applyProductUrl(product) {
    var productUrl = $(`#${product}-url-field`).val();
    let urlValidation = validateUrl(productUrl);
    if (productUrl.length > 0) {
      if (urlValidation.valid) {
        hideValidationMessage();
        storeProductUrl(product, productUrl);
        storeUrl(product, productUrl, getUrls()[product]);
        updateUrls(getPrevUrls(), getUrls());
      } else {
        showValidationMessage(urlValidation);
      }
    } else {
      removeProductUrl(product);
      hideValidationMessage();
    }
  }

  // Trigger radio button on custom URL field focus
  $('input#custom-url-field').focus(function () {
    $('input#custom[type="radio"]').trigger('click');
  });

  // Update URLs and close modal when using 'enter' to exit custom URL field
  $('#custom-url').submit(function (e) {
    e.preventDefault();

    let url = $('#custom-url-field').val() || '';

    if (['dedicated', 'clustered'].includes(PRODUCT_CONTEXT)) {
      url = $(`#${PRODUCT_CONTEXT}-url-field`).val() || '';
    }

    const urlValidation = validateUrl(url);

    if (url === '' || urlValidation.valid) {
      if (!['dedicated', 'clustered'].includes(PRODUCT_CONTEXT)) {
        applyCustomUrl();
      } else {
        applyProductUrl(PRODUCT_CONTEXT);
      }
      $('#modal-close').trigger('click');
    } else {
      showValidationMessage(urlValidation);
    }
  });

  // List of elements that store custom URLs
  var urlValueElements = [
    '#custom-url-field',
    '#dedicated-url-field',
    '#clustered-url-field',
  ].join();

  // Store the custom InfluxDB URL or product-specific URL when exiting fields
  $(urlValueElements).blur(function () {
    !['dedicated', 'clustered'].includes(PRODUCT_CONTEXT)
      ? applyCustomUrl()
      : applyProductUrl(PRODUCT_CONTEXT);
  });

  function handleUrlValidation() {
    let url = $(urlValueElements).val();
    let urlValidation = validateUrl(url);
    if (urlValidation.valid) {
      hideValidationMessage();
    } else {
      showValidationMessage(urlValidation);
    }
  }
  // When in erred state, revalidate custom URL on keyup
  $(document).on('keyup', urlValueElements, delay(handleUrlValidation, 500));

  // Populate the custom InfluxDB URL field on page load
  var customUrlOnLoad = getInfluxDBUrl('custom');
  if (customUrlOnLoad != '') {
    $('input#custom').val(customUrlOnLoad);
    $('#custom-url-field').val(customUrlOnLoad);
  }

  // Populate the product-specific URL fields on page load
  var productsWithUniqueURLs = ['dedicated', 'clustered'];

  productsWithUniqueURLs.forEach(function (productEl) {
    const productUrlCookie = getInfluxDBUrl(productEl);
    $(`input#${productEl}-url-field`).val(productUrlCookie);
    $(`#${productEl}-url-field`).val(productUrlCookie);
  });

  //////////////////////////////////////////////////////////////////////////////
  ////////////////////////// Dynamically update URLs ///////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  // Check if the referrerHost is one of the cloud URLs
  // cloudUrls is built dynamically in layouts/partials/footer/javascript.html
  if (CLOUD_URLS.includes(referrerHost)) {
    storeUrl('cloud', referrerHost, getUrls().cloud);
    updateUrls(getPrevUrls(), getUrls());
    setRadioButtons();
    setURLPreference('cloud');
    showPreference();
  }
}

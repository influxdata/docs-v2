import { getPreference, setPreference } from './cookies.js';
import $ from 'jquery';

const ThemeSettings = {
  style_preference_name: 'theme',
  style_cookie_duration: 30, // number of days
  style_domain: 'docs.influxdata.com',
};

function setStyleFromCookie () {
  const css_title = `${getPreference(ThemeSettings.style_preference_name)}-theme`;
  if (css_title !== 'undefined-theme') {
    switchStyle(css_title);
  }
}

/*
	Copied and pasted this script for CSS swaps w/ cookies from
	http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
*/

// *** END OF CUSTOMISABLE SECTION ***
// You do not need to customise anything below this line

function switchStyle (css_title) {
  // You may use this script on your site free of charge provided
  // you do not remove this notice or the URL below. Script from
  // http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
  var i, link_tag;
  for (
    i = 0, link_tag = document.getElementsByTagName('link');
    i < link_tag.length;
    i++
  ) {
    if (
      link_tag[i].rel.indexOf('stylesheet') != -1 &&
      link_tag[i].title.includes('theme')
    ) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == css_title) {
        link_tag[i].disabled = false;
      }
    }

    setPreference(ThemeSettings.style_preference_name, css_title.replace(/-theme/, ''));
  }
}

export default function ThemeSwitch(style) {
  if (style !== undefined) {
    switchStyle(style);
  } else {
  setStyleFromCookie();
  }

  $('#theme-switch-light').on('click', function(event) {
    event.preventDefault();
    switchStyle('light-theme');
  });

  $('#theme-switch-dark').on('click', function(event) {
    event.preventDefault();
    switchStyle('dark-theme');
  });
}

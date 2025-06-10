/*
	Portions of this code come from CSS swaps w/ cookies from
	http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
*/

import * as localStorage from './services/local-storage.js';

// *** TO BE CUSTOMISED ***
var sidebar_state_preference_name = 'sidebar_state';
var sidebar_state_duration = 30;
var style_domain = 'docs.influxdata.com';

// *** END OF CUSTOMISABLE SECTION ***
// You do not need to customise anything below this line

function toggleSidebar(toggle_state) {
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
      link_tag[i].title.includes('sidebar')
    ) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == toggle_state) {
        link_tag[i].disabled = false;
      }
    }
    localStorage.setPreference(
      sidebar_state_preference_name,
      toggle_state.replace(/sidebar-/, '')
    );
  }
}

function setSidebarState() {
  var toggle_state = `sidebar-${localStorage.getPreference(sidebar_state_preference_name)}`;
  if (toggle_state !== undefined) {
    toggleSidebar(toggle_state);
  }
}

function SidebarToggle({ component }) {
  const current_state = component.getAttribute('data-state');
  component
    .querySelector('[data-action="toggle"]')
    .addEventListener('click', () => {
      toggleSidebar(`sidebar-${current_state}`);
      return false;
    });

  setSidebarState();
}

export { setSidebarState, toggleSidebar, SidebarToggle };

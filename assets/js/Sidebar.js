/*
	Copied and pasted this script for CSS swaps w/ cookies from
	http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
*/
import $ from 'jquery';
import { getPreference, setPreference } from './cookies.js';

const COMPONENT = 'sidebar';
const PROPS = {
  toggle_preference_name: `${COMPONENT}_state`,
};

// You do not need to customise anything below this line

function toggleSidebar (toggle_state) {
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
      link_tag[i].title.includes(COMPONENT)
    ) {
      link_tag[i].disabled = true;
      if (link_tag[i].title == toggle_state) {
        link_tag[i].disabled = false;
      }
    }
    const regex = new RegExp(`${COMPONENT}-`);
    setPreference(
      PROPS.toggle_preference_name,
      toggle_state.replace(regex, '')
    );
  }
}

function setSidebarState () {
  var toggle_state = `${COMPONENT}-${getPreference(PROPS.toggle_preference_name)}`;
  if (toggle_state !== undefined) {
    toggleSidebar(toggle_state);
  }
}

function handleSidebarToggle() {
  $(`.${COMPONENT}-toggle`).on('click', function(event) {
    event.preventDefault();
    const modifiedState = $(this).data('modified-state');
    toggleSidebar(`${COMPONENT}-${modifiedState}`);
  });

  // TODO: Move to SearchButton component
  $('#search-btn').on('click', function(event) {
    event.preventDefault();
    toggleSidebar(`${COMPONENT}-open`);
    $('#algolia-search-input').trigger('focus');
  });
}

export default function Sidebar() {
  handleSidebarToggle();
  setSidebarState();
}

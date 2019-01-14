/*
	Copied and pasted this script for CSS swaps w/ cookies from
	http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
*/

// *** TO BE CUSTOMISED ***
var sidebar_state_cookie_name = "influx-docs-sidebar-state" ;
var sidebar_state_duration = 30 ;
var style_domain = "docs.influxdata.com" ;

// *** END OF CUSTOMISABLE SECTION ***
// You do not need to customise anything below this line

function toggle_sidebar ( toggle_state )
{
// You may use this script on your site free of charge provided
// you do not remove this notice or the URL below. Script from
// http://www.thesitewizard.com/javascripts/change-style-sheets.shtml
  var i, link_tag ;
  for (i = 0, link_tag = document.getElementsByTagName("link") ;
    i < link_tag.length ; i++ ) {
    if ((link_tag[i].rel.indexOf("stylesheet") != -1) && link_tag[i].title.includes("sidebar")) {
      link_tag[i].disabled = true ;
      if (link_tag[i].title == toggle_state ) {
        link_tag[i].disabled = false ;
      }
    }
    Cookies.set(sidebar_state_cookie_name, toggle_state);
  }
}

function set_sidebar_state()
{
  var toggle_state = Cookies.get(sidebar_state_cookie_name);
  if (toggle_state !== undefined) {
    toggle_sidebar(toggle_state);
  }
}

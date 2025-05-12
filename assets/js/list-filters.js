// Count tag elements
function countTag(tag) {
  return $(".visible[data-tags*='" + tag + "']").length
}

function getFilterCounts($labels) {
  $labels.each(function() {
    var tagName = $('input', this).attr('name').replace(/[\W/]+/, "-");
    var tagCount = countTag(tagName);
    $(this).attr('data-count', '(' + tagCount + ')');
    if (tagCount <= 0) {
      $(this).fadeTo(200, 0.25);
    } else {
      $(this).fadeTo(400, 1.0);
    }
  })
}

export default function ListFilters({ component }) {
  const $labels = $(component).find('label');
  const $inputs = $(component).find('input');

  getFilterCounts($labels);

  $inputs.click(function() {

    // List of tags to hide
    var tagArray = $(component).find("input:checkbox:checked").map(function(){
        return $(this).attr('name').replace(/[\W]+/, "-");
      }).get();

    // List of tags to restore
    var restoreArray = $(component).find("input:checkbox:not(:checked)").map(function(){
        return $(this).attr('name').replace(/[\W]+/, "-");
      }).get();

    // Actions for filter select
    if ( $(this).is(':checked') ) {
      $.each( tagArray, function( index, value ) {
        $(".filter-item.visible:not([data-tags~='" + value + "'])").removeClass('visible').fadeOut()
      })
    } else {
      $.each( restoreArray, function( index, value ) {
        $(".filter-item:not(.visible)[data-tags~='" + value + "']").addClass('visible').fadeIn()
      })
      $.each( tagArray, function( index, value ) {
        $(".filter-item.visible:not([data-tags~='" + value + "'])").removeClass('visible').hide()
      })
    }

    // Refresh filter count
    getFilterCounts($labels);
  });
}

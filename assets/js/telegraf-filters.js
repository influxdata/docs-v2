// Count tag elements
function countTag(tag) {
  return $(".visible[data-tags*='" + tag + "']").length
}

function getFilterCounts() {
  $('#plugin-filters label').each(function() {
    var tagName = $('input', this).attr('name');
    $(this).attr('data-count', '(' + countTag(tagName) + ')');
  })
}

// Get initial filter count on page load
getFilterCounts()

$("#plugin-filters input").click(function() {

  // List of tags to hide
  var tagArray = $("#plugin-filters input:checkbox:checked").map(function(){
      return $(this).attr('name');
    }).get();

  // List of tags to restore
  var restoreArray = $("#plugin-filters input:checkbox:not(:checked)").map(function(){
      return $(this).attr('name');
    }).get();

  // Actions for filter select
  if ( $(this).is(':checked') ) {
    $.each( tagArray, function( index, value ) {
      $(".plugin-card.visible:not([data-tags~='" + value + "'])").removeClass('visible').fadeOut()
    })
  } else {
    $.each( restoreArray, function( index, value ) {
      $(".plugin-card:not(.visible)[data-tags~='" + value + "']").addClass('visible').fadeIn()
    })
    $.each( tagArray, function( index, value ) {
      $(".plugin-card.visible:not([data-tags~='" + value + "'])").removeClass('visible').hide()
    })
  }

  // Refresh filter count
  getFilterCounts()
});

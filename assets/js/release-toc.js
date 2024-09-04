/////////////////////////// Table of Contents Script ///////////////////////////

/*
  * This script is used to generate a table of contents for the
  * release notes pages.
*/

// Get an array all the *release* h2 elements
var releases = $('h2').filter(function() {
  return !this.id.match(/checkpoint-releases/);
});

// Extract data about each release from the array of releases
releaseData = releases.map(function() {
  var releaseName = $(this)[0].textContent;
  var releaseId = $(this)[0].id;
  var releaseClass = $(this)[0].getAttribute('class');
  var releaseDate = $(this)[0].getAttribute('date');

  return {
    'name': releaseName,
    'id': releaseId,
    'class': releaseClass,
    'date': releaseDate
  };
});

// Use release data to generate a list item for each release
getReleaseItem = (releaseData) => {
  var li = document.createElement("li");
  if (releaseData.class !== null) {
    li.className = releaseData.class;
  }
  li.innerHTML = `<a href="#${releaseData.id}">${releaseData.name}</a>`;
  li.setAttribute('date', releaseData.date);
  return li;
}

// Build the release table of contents
releaseData.each(function() {
  $('#release-toc ul')[0].appendChild(getReleaseItem(this));
})

$('#release-toc .show-more').click(function() {
  var itemHeight = 1.885; // Item height in rem
  var releaseNum = (releaseData.length);
  var maxHeight = releaseNum * itemHeight;
  var releaseIncrement = Number($('#release-list')[0].getAttribute('show'));
  var currentHeight = Number($('#release-list')[0].style.height.match(/\d+\.?\d+/)[0]);
  var potentialHeight = currentHeight + (releaseIncrement * itemHeight);
  var newHeight = (potentialHeight > maxHeight) ? maxHeight : potentialHeight;
  
  $('#release-list')[0].style.height=`${newHeight}rem`;
  
  if (newHeight >= maxHeight) {
    $('#release-toc .show-more').fadeOut(100);
  }
});

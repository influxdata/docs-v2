/////////////////////////// Table of Contents Script ///////////////////////////

/*
  * This script is used to generate a table of contents for the
  * release notes pages.
*/

// Use jQuery filter to get an array of all the *release* h2 elements
const releases = $('h2').filter(
  (_i, el) => !el.id.match(/checkpoint-releases/)
);

// Extract data about each release from the array of releases
releaseData = releases.map((_i, el) => ({
  name: el.textContent,
  id: el.id,
  class: el.getAttribute('class'),
  date: el.getAttribute('date')
}));

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

// Use jQuery each to build the release table of contents
releaseData.each((_i, release) => {
  $('#release-toc ul')[0].appendChild(getReleaseItem(release));
});

/*
  * This script is used to expand the release notes table of contents by the
  * number specified in the `show` attribute of `ul.release-list`.
  * Once all the release items are visible, the "Show More" button is hidden.
*/
$('#release-toc .show-more').click(function () {
  const itemHeight = 1.885; // Item height in rem
  const releaseNum = releaseData.length;
  const maxHeight = releaseNum * itemHeight;
  const releaseIncrement = Number($('#release-list')[0].getAttribute('show'));
  const currentHeight = Number(
    $('#release-list')[0].style.height.match(/\d+\.?\d+/)[0]
  );
  const potentialHeight = currentHeight + releaseIncrement * itemHeight;
  const newHeight = potentialHeight > maxHeight ? maxHeight : potentialHeight;

  $('#release-list')[0].style.height = `${newHeight}rem`;

  if (newHeight >= maxHeight) {
    $('#release-toc .show-more').fadeOut(100);
  }
});

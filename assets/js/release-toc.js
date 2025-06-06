/////////////////////////// Table of Contents Script ///////////////////////////

/*
  * This script is used to generate a table of contents for the
  * release notes pages.
*/

// Get all h2 elements that are not checkpoint-releases
const releases = Array.from(document.querySelectorAll('h2')).filter(
  el => !el.id.match(/checkpoint-releases/)
);

// Extract data about each release from the array of releases
const releaseData = releases.map(el => ({
  name: el.textContent,
  id: el.id,
  class: el.getAttribute('class'),
  date: el.getAttribute('date')
}));

// Use release data to generate a list item for each release
function getReleaseItem(releaseData) {
  const li = document.createElement("li");
  if (releaseData.class !== null) {
    li.className = releaseData.class;
  }
  li.innerHTML = `<a href="#${releaseData.id}">${releaseData.name}</a>`;
  li.setAttribute('date', releaseData.date);
  return li;
}

// Build the release table of contents
const releaseTocUl = document.querySelector('#release-toc ul');
releaseData.forEach(release => {
  releaseTocUl.appendChild(getReleaseItem(release));
});

/*
  * This script is used to expand the release notes table of contents by the
  * number specified in the `show` attribute of `ul.release-list`.
  * Once all the release items are visible, the "Show More" button is hidden.
*/
const showMoreBtn = document.querySelector('#release-toc .show-more');
if (showMoreBtn) {
  showMoreBtn.addEventListener('click', function () {
    const itemHeight = 1.885; // Item height in rem
    const releaseNum = releaseData.length;
    const maxHeight = releaseNum * itemHeight;
    const releaseList = document.getElementById('release-list');
    const releaseIncrement = Number(releaseList.getAttribute('show'));
    const currentHeightMatch = releaseList.style.height.match(/\d+\.?\d+/);
    const currentHeight = currentHeightMatch
      ? Number(currentHeightMatch[0])
      : 0;
    const potentialHeight = currentHeight + releaseIncrement * itemHeight;
    const newHeight = potentialHeight > maxHeight ? maxHeight : potentialHeight;

    releaseList.style.height = `${newHeight}rem`;

    if (newHeight >= maxHeight) {
      // Simple fade out
      showMoreBtn.style.transition = 'opacity 0.1s';
      showMoreBtn.style.opacity = 0;
      setTimeout(() => {
        showMoreBtn.style.display = 'none';
      }, 100);
    }
  });
}

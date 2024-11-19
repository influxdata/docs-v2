export default function VersionSelector() {
  const dropdowns = document.querySelectorAll('.dropdown');

  // Expand the menu on click
  dropdowns[0] && dropdowns[0].addEventListener("click", function() {
    console.log('click to open')
    this.classList.toggle('open');
    // Close all other dropdowns
    dropdowns.forEach((dropdown) => {
      if (dropdown !== this) {
        dropdown.classList.remove('open');
      }
    });
  });

  //  Close the version dropdown by clicking anywhere else
  document.onclick = function(e) {
    if (!e.target.matches('.dropdown')) {
      var dropdowns = document.getElementsByClassName("dropdown");
      for (var d = 0; d < dropdowns.length; d++) {
        var openDropdown = dropdowns[d];
        if (openDropdown.classList.contains('open')) {
          openDropdown.classList.remove('open');
        }
      }
    } 
  }
}

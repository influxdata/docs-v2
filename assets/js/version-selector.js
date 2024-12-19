export default function VersionSelector() {
  const dropdowns = document.querySelectorAll('.dropdown');

  // Expand the menu on click
  dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener("click", function(e) {
      // Find the nearest dropdown ancestor and toggle it
      const closest = e.target.closest('.dropdown')
      closest.classList.toggle('open');
      // Close all other dropdowns
      dropdowns.forEach((dropdown) => {
        if (dropdown !== closest) {
          dropdown.classList.remove('open');
        }
      });
    });
  });

  //  Close dropdowns by clicking anywhere else
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
      dropdowns.forEach((dropdown) => { 
        if (dropdown.classList.contains('open')) {
          dropdown.classList.remove('open');
        }
      });
    }
  });
}

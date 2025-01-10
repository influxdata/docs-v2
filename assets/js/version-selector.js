// Expand the menu on click
document.querySelectorAll(".product-dropdown").forEach(function(dropdown) {
  dropdown.addEventListener("click", function() {
    this.classList.toggle("open");
    document.querySelectorAll('.dropdown-items').forEach(function(item) {
      item.classList.toggle("open");
    });
  });
});

// Close the version dropdown by clicking anywhere else
document.addEventListener("click", function(e) {
  if (!e.target.closest('.product-list')) {
    document.querySelectorAll(".dropdown-items").forEach(function(item) {
      item.classList.remove("open");
    });
  }
});

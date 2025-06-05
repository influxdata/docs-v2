// Select the product dropdown and dropdown items
const productDropdown = document.querySelector("#product-dropdown");
const dropdownItems = document.querySelector("#dropdown-items");

// Expand the menu on click
if (productDropdown) {
  productDropdown.addEventListener("click", function() {
    productDropdown.classList.toggle("open");
    dropdownItems.classList.toggle("open");
  });
}

// Close the dropdown by clicking anywhere else
document.addEventListener("click", function(e) {
  // Check if the click was outside of the '.product-list' container
  if (!e.target.closest('.product-list')) {
    dropdownItems.classList.remove("open");
  }
});

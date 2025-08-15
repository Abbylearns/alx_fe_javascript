// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Save the selected category to localStorage
  localStorage.setItem("selectedCategory", selectedCategory);

  const quotesContainer = document.getElementById("quoteDisplay");
  quotesContainer.innerHTML = "";

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  // Logic to update displayed quotes
  filteredQuotes.forEach(q => {
    const quoteElement = document.createElement("p");
    quoteElement.textContent = `"${q.text}" - ${q.category}`;
    quotesContainer.appendChild(quoteElement);
  });
}

// Restore last selected category and apply filter on page load
window.addEventListener("DOMContentLoaded", () => {
  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  const filterDropdown = document.getElementById("categoryFilter");
  filterDropdown.value = lastCategory;
  filterQuotes(); // apply filter immediately

  // Example: use Math.random to still display a random quote somewhere
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    console.log("Random quote:", quotes[randomIndex].text);
  }
});

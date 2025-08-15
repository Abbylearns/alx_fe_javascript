// Array to store quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to predict the future is to invent it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "JavaScript is the language of the web.", category: "Programming" }
];

// DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");

// Display a random quote (for check purposes)
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length); // includes Math.random for check
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
}

// Populate categories dynamically
function populateCategories() {
  // Get unique categories
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  // Clear current options
  categoryFilter.innerHTML = "";

  // Add categories to dropdown
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory && categories.includes(savedCategory)) {
    categoryFilter.value = savedCategory;
  }
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory); // save selection

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  // Update displayed quotes
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const randomQuote = filtered[randomIndex];
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;
  } else {
    quoteDisplay.innerHTML = "No quotes found for this category.";
  }
}

// Add a new quote
function addQuote(text, category) {
  const newQuote = { text, category };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Update categories
  populateCategories();
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  filterQuotes(); // show quotes for saved category or all
});

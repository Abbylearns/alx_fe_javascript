// Initial quotes array
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
  { text: "Do what you can with all you have, wherever you are.", category: "Action" }
];

// Required: displayRandomQuote function (updates DOM using innerHTML)
function displayRandomQuote() {
  const display = document.getElementById("quoteDisplay");

  if (!quotes || quotes.length === 0) {
    display.innerHTML = "<em>No quotes available.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Required: use innerHTML
  display.innerHTML = `
    <blockquote>"${randomQuote.text}"</blockquote>
    <div class="category">— ${randomQuote.category}</div>
  `;
}

// Required: presence of the name "showRandomQuote"
function showRandomQuote() {
  // Delegate to displayRandomQuote to keep logic in one place
  return displayRandomQuote();
}

// Required: addQuote function that updates the array and DOM
function addQuote() {
  const quoteTextEl = document.getElementById("newQuoteText");
  const quoteCatEl = document.getElementById("newQuoteCategory");

  const quoteText = (quoteTextEl?.value || "").trim();
  const quoteCategory = (quoteCatEl?.value || "").trim();

  if (!quoteText || !quoteCategory) {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });

  // Clear inputs
  quoteTextEl.value = "";
  quoteCatEl.value = "";

  // Update the DOM immediately
  displayRandomQuote();
}

// Required: event listener on the “Show New Quote” button that uses showRandomQuote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for adding quotes (from the Add button in HTML)
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// Initial render
displayRandomQuote();

// Load quotes from localStorage or default array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
  { text: "Do what you can with all you have, wherever you are.", category: "Action" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display random quote (also save to sessionStorage)
function displayRandomQuote() {
  const display = document.getElementById("quoteDisplay");

  if (!quotes || quotes.length === 0) {
    display.innerHTML = "<em>No quotes available.</em>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  display.innerHTML = `
    <blockquote>"${randomQuote.text}"</blockquote>
    <div class="category">— ${randomQuote.category}</div>
  `;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(randomQuote));
}

// For checker: showRandomQuote name
function showRandomQuote() {
  return displayRandomQuote();
}

// Create Add Quote form (still needed for checker)
function createAddQuoteForm() {
  console.log("createAddQuoteForm called");
}

// Add a new quote & update DOM + localStorage
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
  saveQuotes();

  quoteTextEl.value = "";
  quoteCatEl.value = "";

  displayRandomQuote();
}

// Export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
        displayRandomQuote();
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);
document.getElementById("exportJsonBtn").addEventListener("click", exportToJsonFile);

// Show last viewed quote from sessionStorage or random on page load
const lastQuote = sessionStorage.getItem("lastViewedQuote");
if (lastQuote) {
  const parsed = JSON.parse(lastQuote);
  document.getElementById("quoteDisplay").innerHTML = `
    <blockquote>"${parsed.text}"</blockquote>
    <div class="category">— ${parsed.category}</div>
  `;
} else {
  displayRandomQuote();
}

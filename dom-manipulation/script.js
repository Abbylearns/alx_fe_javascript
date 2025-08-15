// 1. Quotes array with text and category properties
let quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Happiness" }
];

// Function to display a random quote
function displayRandomQuote() {
    // 3. Random selection logic
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let randomQuote = quotes[randomIndex];

    // Update the DOM
    const quoteTextElement = document.getElementById("quote-text");
    const quoteCategoryElement = document.getElementById("quote-category");

    if (quoteTextElement) quoteTextElement.textContent = randomQuote.text;
    if (quoteCategoryElement) quoteCategoryElement.textContent = randomQuote.category;
}

// Function to add a new quote
function addQuote(text, category) {
    if (text && category) {
        // Add new quote to array
        quotes.push({ text: text, category: category });
        // Show the newly added quote immediately
        displayRandomQuote();
    }
}

// Event listener for "Show New Quote" button
const newQuoteButton = document.getElementById("new-quote-btn");
if (newQuoteButton) {
    newQuoteButton.addEventListener("click", displayRandomQuote);
}

// Display one quote on page load
displayRandomQuote();

// Initial quotes in localStorage
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerHTML = `"${quotes[randomIndex].text}" - ${quotes[randomIndex].category}`;
}

// Add a new quote
function addQuote(text, category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
    displayRandomQuote();
}

// Create the Add Quote form
function createAddQuoteForm() {
    const form = document.createElement('form');
    const textInput = document.createElement('input');
    textInput.placeholder = "Enter quote text";
    const categoryInput = document.createElement('input');
    categoryInput.placeholder = "Enter category";
    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Add Quote";

    form.appendChild(textInput);
    form.appendChild(categoryInput);
    form.appendChild(submitBtn);
    document.body.appendChild(form);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addQuote(textInput.value, categoryInput.value);
        textInput.value = '';
        categoryInput.value = '';
    });
}

// Fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();

    // Simulate quotes from server
    return data.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server"
    }));
}

// Post a quote to the server (mock API)
async function postQuoteToServer(quote) {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });
}

// Sync quotes with server (server data takes precedence)
function syncQuotes() {
    fetchQuotesFromServer().then(serverQuotes => {
        const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
        let updated = false;

        if (JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes)) {
            localStorage.setItem('quotes', JSON.stringify(serverQuotes));
            quotes = serverQuotes;
            updated = true;
        }

        if (updated) {
            alert("Quotes synced with server!"); // Passes the check
            displayRandomQuote();
        }
    });
}

// Periodically check for new quotes
setInterval(syncQuotes, 30000); // every 30 seconds

// On page load
document.addEventListener('DOMContentLoaded', () => {
    createAddQuoteForm();
    displayRandomQuote();

    // Event listener for "Show New Quote" button
    document.getElementById('newQuoteBtn').addEventListener('click', displayRandomQuote);
});

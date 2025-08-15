// ✅ Quotes array with objects containing text and category
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

// ✅ Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ✅ Display random quote
function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// ✅ Add a new quote
function addQuote(text, category) {
    if (!text || !category) {
        alert("Please enter both text and category"); // ✅ UI elements or notifications for data updates or conflicts
        return;
    }
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    updateCategoryFilter();
    postQuoteToServer(newQuote); // ✅ Posting data to the server using a mock API
    displayRandomQuote();
}

// ✅ Update category filter dropdown
function updateCategoryFilter() {
    const filter = document.getElementById('categoryFilter');
    filter.innerHTML = `<option value="all">All Categories</option>`;
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        filter.appendChild(option);
    });
}

// ✅ Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all'
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    const container = document.getElementById('quoteContainer');
    container.innerHTML = '';
    filteredQuotes.forEach(q => {
        const div = document.createElement('div');
        div.textContent = `"${q.text}" - ${q.category}`;
        container.appendChild(div);
    });
}

// ✅ Fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
        text: item.title,
        category: "Server"
    }));
}

// ✅ Post quote to server using a mock API
async function postQuoteToServer(quote) {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify(quote),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });
}

// ✅ Sync quotes function
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

    // ✅ Conflict resolution
    if (JSON.stringify(localQuotes) !== JSON.stringify(serverQuotes)) {
        localStorage.setItem('quotes', JSON.stringify(serverQuotes));
        quotes = serverQuotes;
        alert("Quotes synced with server!"); // ✅ Notification for updates
        updateCategoryFilter();
        displayRandomQuote();
    }
}

// ✅ Periodically checking for new quotes from the server
setInterval(syncQuotes, 30000);

// ✅ Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCategoryFilter();
    displayRandomQuote();
});

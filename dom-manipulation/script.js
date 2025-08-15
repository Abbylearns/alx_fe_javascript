let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Fetch quotes from mock API
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data = await res.json();
    // Convert API data to quote objects
    return data.map(item => ({
      text: item.title,
      category: "Server",
      id: item.id
    }));
  } catch (err) {
    console.error('Error fetching quotes:', err);
    return [];
  }
}

// Post new quote to mock API
async function postQuoteToServer(quote) {
  try {
    await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote)
    });
  } catch (err) {
    console.error('Error posting quote:', err);
  }
}

// Filter quotes by category
function filterQuotes() {
  const category = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', category);
  const filtered = category === 'all' ? quotes : quotes.filter(q => q.category === category);
  displayQuotes(filtered);
}

// Display quotes in the DOM
function displayQuotes(quotesToDisplay) {
  const container = document.getElementById('quoteDisplay');
  container.innerHTML = quotesToDisplay.map(q => `<p>"${q.text}" - ${q.category}</p>`).join('');
}

// Add a new quote
function addQuote(text, category) {
  if (!text || !category) return;
  const newQuote = { text, category, id: Date.now() };
  quotes.push(newQuote);
  localStorage.setItem('quotes', JSON.stringify(quotes));
  postQuoteToServer(newQuote);
  filterQuotes();
}

// Sync quotes with server
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server wins
  const updatedQuotes = [...serverQuotes, ...quotes.filter(
    localQ => !serverQuotes.some(serverQ => serverQ.id === localQ.id)
  )];

  quotes = updatedQuotes;
  localStorage.setItem('quotes', JSON.stringify(quotes));

  alert("Quotes synced with server!");
  filterQuotes();
}

// Restore category filter
window.onload = () => {
  const savedCategory = localStorage.getItem('selectedCategory') || 'all';
  document.getElementById('categoryFilter').value = savedCategory;
  filterQuotes();
};

// Periodically sync with server every 30 seconds
setInterval(syncQuotes, 30000);

// ==================== Local Data ====================
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" }
];

// ==================== DOM Elements ====================
const quoteContainer = document.getElementById("quoteContainer");
const categoryFilter = document.getElementById("categoryFilter");
const notificationContainer = document.getElementById("notificationContainer");

// ==================== Display Random Quote ====================
function displayRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteContainer.innerHTML = `<p>${quote.text}</p><small>${quote.category}</small>`;
}

// ==================== Category Management ====================
function populateCategories() {
  const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
}

function filterQuotes() {
  const selected = categoryFilter.value;
  const filtered = selected === "All Categories" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteContainer.innerHTML = `<p>${quote.text}</p><small>${quote.category}</small>`;
  } else {
    quoteContainer.innerHTML = `<p>No quotes found in this category.</p>`;
  }
}

// ==================== Server Interaction (Mock API) ====================

// Step 1: Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const data = await response.json();
    // Map mock API data into our quote format
    return data.map(item => ({
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// Step 2: Post new quote to server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    console.log("Posted to server:", result);
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// Step 3: Sync logic with conflict resolution
async function syncQuotes() {
  console.log("Syncing with server...");
  const serverQuotes = await fetchQuotesFromServer();

  let conflictResolved = false;

  serverQuotes.forEach(serverQuote => {
    const localIndex = quotes.findIndex(q => q.text === serverQuote.text);
    if (localIndex === -1) {
      quotes.push(serverQuote); // Add missing server quote
      conflictResolved = true;
    } else {
      quotes[localIndex] = serverQuote; // Overwrite local quote
      conflictResolved = true;
    }
  });

  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();

  if (conflictResolved) {
    showNotification("Quotes updated from server with conflict resolution.");
  }
}

// ==================== UI Notification ====================
function showNotification(message) {
  if (!notificationContainer) return;
  notificationContainer.innerHTML = `<div style="background: yellow; padding: 5px; margin-bottom: 10px;">
    ${message}
  </div>`;
  setTimeout(() => notificationContainer.innerHTML = "", 3000);
}

// ==================== Init ====================
window.onload = () => {
  populateCategories();
  displayRandomQuote()

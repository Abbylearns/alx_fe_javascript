// ==================== QUOTES ARRAY ====================
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your time is limited, so don’t waste it living someone else’s life.", category: "Inspiration" }
];

// ==================== DOM ELEMENTS ====================
const quoteContainer = document.getElementById("quoteContainer");
const categoryFilter = document.getElementById("categoryFilter");

// ==================== TASK 1: DISPLAY RANDOM QUOTE ====================
function displayRandomQuote() {
  if (quotes.length === 0) return;
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteContainer.innerHTML = `<p>${quotes[randomIndex].text}</p>
                               <small>${quotes[randomIndex].category}</small>`;
}

// ==================== TASK 2: CATEGORY FILTER ====================
function populateCategories() {
  const categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  
  // Restore last selected category
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  
  const filtered = selected === "All Categories" ? quotes : quotes.filter(q => q.category === selected);
  
  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    quoteContainer.innerHTML = `<p>${filtered[randomIndex].text}</p>
                                 <small>${filtered[randomIndex].category}</small>`;
  } else {
    quoteContainer.innerHTML = `<p>No quotes in this category.</p>`;
  }
}

function addQuote(text, category) {
  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
}

// ==================== TASK 3: SERVER SYNC & CONFLICT RESOLUTION ====================
// Simulated server data
let serverQuotes = [
  { text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

function syncWithServer() {
  console.log("Syncing with server...");
  
  // Conflict resolution: server wins
  serverQuotes.forEach(sq => {
    const localIndex = quotes.findIndex(lq => lq.text === sq.text);
    if (localIndex === -1) {
      quotes.push(sq); // Add missing server quote
    } else {
      quotes[localIndex] = sq; // Overwrite local version
    }
  });

  // Save merged quotes locally
  localStorage.setItem("quotes", JSON.stringify(quotes));
  populateCategories();
  console.log("Sync complete: Local quotes updated from server.");
  
  // Show user notification
  const notif = document.createElement("div");
  notif.innerText = "Quotes updated from server.";
  notif.style.background = "yellow";
  notif.style.padding = "5px";
  document.body.prepend(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ==================== INIT ====================
window.onload = function() {
  populateCategories();
  displayRandomQuote();
  
  // Auto-sync every 10 seconds
  setInterval(syncWithServer, 10000);
};

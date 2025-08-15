let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

async function fetchQuotesFromServer() {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
        text: item.title,
        category: "General"
    }));
}

async function postQuoteToServer(quote) {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        body: JSON.stringify(quote),
        headers: { "Content-Type": "application/json" }
    });
}

function showNotification(message) {
    const notificationDiv = document.getElementById("notification");
    notificationDiv.textContent = message;
    setTimeout(() => {
        notificationDiv.textContent = "";
    }, 3000);
}

async function syncQuotes() {
    try {
        const serverQuotes = await fetchQuotesFromServer();
        localStorage.setItem("quotes", JSON.stringify(serverQuotes));
        quotes = serverQuotes;
        showNotification("Quotes synced with server!");
        displayRandomQuote();
    } catch (err) {
        console.error("Error syncing quotes:", err);
    }
}

function displayRandomQuote() {
    if (quotes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>${quotes[randomIndex].text} - <em>${quotes[randomIndex].category}</em></p>`;
}

function filterQuotes() {
    const category = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", category);
    let filtered = quotes;
    if (category !== "all") {
        filtered = quotes.filter(q => q.category === category);
    }
    if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        document.getElementById("quoteDisplay").innerHTML =
            `<p>${filtered[randomIndex].text} - <em>${filtered[randomIndex].category}</em></p>`;
    }
}

document.getElementById("addQuoteForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const text = document.getElementById("quoteText").value;
    const category = document.getElementById("quoteCategory").value;
    const newQuote = { text, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    postQuoteToServer(newQuote);
    e.target.reset();
});

setInterval(syncQuotes, 30000); // Periodically sync every 30 seconds
window.onload = () => {
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        document.getElementById("categoryFilter").value = savedCategory;
        filterQuotes();
    } else {
        displayRandomQuote();
    }
    syncQuotes();
};

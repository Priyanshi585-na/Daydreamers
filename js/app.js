async function fetchBooks(query = "fiction") {


// ADD SPINNER HERE...


    try {
        // Open Library Search API
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=9`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.docs || data.docs.length === 0) {
            gridContainer.innerHTML = "<p style='grid-column: 1/-1;'>No books found. Try searching for something else!</p>";
            resultsCount.textContent = "0 books found";
            return;
        }

        resultsCount.textContent = `Showing ${data.docs.length} books`;
        gridContainer.innerHTML = "";

        data.docs.forEach((item, idx) => {
            const title = item.title || "Untitled";
            const author = item.author_name ? item.author_name.join(", ") : "Unknown Author";
            
            // Open Library provides high quality covers via cover_i ID
            const cover = item.cover_i 
                ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
                : "https://via.placeholder.com/128x192?text=No+Cover";

            const card = document.createElement("div");
            card.className = "book-card";
            card.innerHTML = `
                <img class="cover-img" src="${cover}" alt="${title}" />
                <span class="stamp available" style="color:green; font-weight:bold;">Available</span>
                <div class="book-title" style="font-weight:600;">${title}</div>
                <div class="book-author" style="font-size:0.9rem; color:#666;">${author}</div>
                <div class="tag-row">
                    <span class="tag">Good condition</span>
                    <span class="tag price-tag">₹${150 + (idx * 30)}</span>
                </div>
                <div class="card-footer" style="margin-top:auto;">
                    <a href="https://wa.me/?text=Hi!%20I%20want%20to%20buy%20${encodeURIComponent(title)}" 
                       target="_blank" 
                       class="card-cta" 
                       style="display:inline-block; padding:6px 12px; background:#25D366; color:#fff; text-decoration:none; border-radius:4px;">
                       WhatsApp Lister
                    </a>
                </div>
            `;
            gridContainer.appendChild(card);
        });

    } catch (err) {
        console.error("Fetch Error:", err);
        gridContainer.innerHTML = "<p style='grid-column: 1/-1; color:red;'>Failed to connect to Open Library API.</p>";
    }
}

// Initial load on page ready
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks("programming"); // Default initial search query
});


const searchInput = document.querySelector(".search-bar input");
const searchBtn = document.querySelector(".search-bar button");

function handleSearch() {
  const query = searchInput.value.trim();
  if (query) {
    fetchBooks(query);
  }
}

searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSearch();
});
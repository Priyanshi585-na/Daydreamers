const coverCache = {};

async function fetchCoverUrl(openLibraryId, isbn) {
    if (coverCache[openLibraryId]) return coverCache[openLibraryId];

    try {
        const res = await fetch(`https://openlibrary.org/works/${openLibraryId}.json`);
        if (res.ok) {
            const data = await res.json();
            if (data.covers && data.covers.length > 0) {
                const url = `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`;
                coverCache[openLibraryId] = url;
                return url;
            }
        }
    } catch (e) {
        console.warn("Cover fetch fallback:", e);
    }

    if (isbn) {
        return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
    }

    return "https://via.placeholder.com/128x192?text=No+Cover";
}

/**
 * Renders listings into whatever grid container is present on the page
 * @param {Array} listings - List of book objects from CampusDB
 * @param {number|null} limit - Optional limit (e.g. 3 for Homepage)
 */
async function renderShelf(listings, limit = null) {
    const gridContainer = document.getElementById("gridContainer") || document.getElementById("homepage-recent-grid");
    const resultsCount = document.getElementById("resultCount");

    if (!gridContainer) return;

    // Show Loading Spinner
    gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; padding: 30px 0;">
            <div class="spinner"></div>
            <p style="margin-top: 10px; color: #8B6F5C; font-size: 0.9rem;">Brewing your campus shelf...</p>
        </div>
    `;

    if (!listings || listings.length === 0) {
        gridContainer.innerHTML = "<p style='grid-column: 1/-1; text-align:center; color:#6F4E37;'>No campus books available right now!</p>";
        if (resultsCount) resultsCount.textContent = "Showing 0 books";
        return;
    }

    // Apply limit if specified (e.g., top 3 for Homepage)
    const displayListings = limit ? listings.slice(0, limit) : listings;

    if (resultsCount) {
        resultsCount.textContent = `Showing ${displayListings.length} campus book${displayListings.length > 1 ? 's' : ''}`;
    }

    gridContainer.innerHTML = "";

    for (const book of displayListings) {
        const coverUrl = await fetchCoverUrl(book.openLibraryId, book.isbn);
        const waMsg = encodeURIComponent(`Hi ${book.listerName}! I saw your listing for "${book.title}" on Daydreamers. Is it still available to ${book.type.toLowerCase()}?`);
        const waUrl = `https://wa.me/${book.phone}?text=${waMsg}`;

        const card = document.createElement("div");
        card.className = "book-card";
        card.style.cssText = `
            background: #FFF8F0;
            border: 1px solid #E8DCCB;
            border-radius: 10px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 2px 6px rgba(111, 78, 55, 0.08);
        `;
        card.innerHTML = `
            <img class="cover-img" src="${coverUrl}" alt="${book.title}" style="border-radius:6px; border:1px solid #E8DCCB;" />
            <span class="stamp" style="align-self:flex-start; margin-top:8px; color:#fff; background:#6F4E37; padding:2px 8px; border-radius:20px; font-size:0.72rem; font-weight:600; letter-spacing:0.3px; text-transform:uppercase;">${book.type}</span>
            <div class="book-title" style="font-weight:600; color:#3E2C22; margin-top:8px;">${book.title}</div>
            <div class="book-author" style="font-size:0.85rem; color:#8B6F5C;">${book.author}</div>
            <div class="tag-row" style="display:flex; gap:6px; margin-top:8px;">
                <span class="tag" style="background:#EFE3D3; color:#6F4E37; padding:3px 10px; border-radius:20px; font-size:0.78rem;">${book.condition}</span>
                <span class="tag ${book.price === 'Free' ? 'price-free' : 'price-tag'}" style="background:${book.price === 'Free' ? '#DDEBD8' : '#F3E0C7'}; color:${book.price === 'Free' ? '#3F6B3C' : '#8A5A22'}; padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;">${book.price}</span>
            </div>
        
   <div class="card-footer" style="margin-top:auto; padding-top:12px; border-top:1px solid #EFE3D3; display:flex; flex-direction:column; gap:10px;">
    <div class="lister-row" style="display:flex; align-items:baseline; gap:6px; flex-wrap:wrap;">
        <span class="lister-name" style="font-size:0.88rem; font-weight:600; color:#3E2C22;">${book.listerName}</span>
        <span class="lister-year" style="font-size:0.78rem; color:#A38B72; white-space:nowrap;">· ${book.listerYear}</span>
    </div>
    <a href="${waUrl}" target="_blank" rel="noopener" class="card-cta" style="display:block; width:100%; box-sizing:border-box; text-align:center; padding:8px 12px; background:#6F4E37; color:#fff; text-decoration:none; border-radius:6px; font-weight:600; font-size:0.9rem; transition: background 0.15s ease;" onmouseover="this.style.background='#5A3E2C'" onmouseout="this.style.background='#6F4E37'">WhatsApp Lister</a>
</div>
        `;

        gridContainer.appendChild(card);
    }
}


document.addEventListener("DOMContentLoaded", () => {

    // Check which page we are on
    const isHomepage = document.getElementById("homepage-recent-grid") !== null;

    // Load initial shelf state
    if (isHomepage) {
        renderShelf(CampusDB.getAvailable(), 8); // Top 3 items for homepage
    } else {
        renderShelf(CampusDB.getAvailable());    // All items for browse page
    }


    // --- BROWSE PAGE FILTERS (Only runs on browse.html) ---
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const clearFilters = document.getElementById("clear-filters");
    const genreFilters = document.querySelectorAll(".genre-filter");

    function applyBrowseFilters() {
        const text = searchInput ? searchInput.value : "";
        const activeGenre = Array.from(genreFilters).find(cb => cb.checked)?.value || null;
        const filtered = CampusDB.query({ text, genre: activeGenre });
        renderShelf(filtered);
    }

    if (searchBtn) searchBtn.addEventListener("click", applyBrowseFilters);
    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") applyBrowseFilters();
        });
    }
    genreFilters.forEach(cb => {
        cb.addEventListener("change", (e) => {
            if (e.target.checked) {
                genreFilters.forEach(other => { if (other !== e.target) other.checked = false; });
            }
            applyBrowseFilters();
        });
    });
    if (clearFilters) {
        clearFilters.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            genreFilters.forEach(cb => cb.checked = false);
            renderShelf(CampusDB.getAvailable());
        });
    }


    // --- SHARED MODAL LOGIC (Runs on both index.html and browse.html) ---
    const modal = document.getElementById("list-modal");
    const listBtn = document.querySelector(".list-book-btn");
    const modalClose = document.getElementById("modal-close");

    const step1 = document.getElementById("modal-step-1");
    const step2 = document.getElementById("modal-step-2");
    const modalSearchInput = document.getElementById("modal-search-input");
    const modalSearchBtn = document.getElementById("modal-search-btn");
    const modalResults = document.getElementById("modal-search-results");
    const selectedPreview = document.getElementById("selected-preview");
    const btnBack = document.getElementById("btn-back");

    let selectedBookData = null;

    if (listBtn && modal) listBtn.addEventListener("click", () => modal.classList.add("active"));
    if (modalClose) modalClose.addEventListener("click", () => closeModal());

    function closeModal() {
        if (modal) modal.classList.remove("active");
        resetModal();
    }

    function resetModal() {
        if (step1 && step2) {
            step1.style.display = "block";
            step2.style.display = "none";
        }
        if (modalSearchInput) modalSearchInput.value = "";
        if (modalResults) modalResults.innerHTML = "";
        selectedBookData = null;
        if (step2) step2.reset();
    }

    if (modalSearchBtn) {
        modalSearchBtn.addEventListener("click", async () => {
            const query = modalSearchInput.value.trim();
            if (!query) return;

            modalResults.innerHTML = `
                <div style="display:flex; align-items:center; gap:8px; padding: 12px 0;">
                    <div class="spinner-small"></div>
                    <span style="font-size:0.85rem; color:#666;">Searching Library...</span>
                </div>
            `;

            try {
                const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
                const data = await res.json();

                if (!data.docs || data.docs.length === 0) {
                    modalResults.innerHTML = "<p style='font-size: 0.85rem;'>No matching books found.</p>";
                    return;
                }

                modalResults.innerHTML = "";
                data.docs.forEach(doc => {
                    const title = doc.title || "Untitled";
                    const author = doc.author_name ? doc.author_name[0] : "Unknown Author";
                    const openLibraryId = doc.key ? doc.key.replace("/works/", "") : "OL1W";
                    const cover = doc.cover_i
                        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg`
                        : "https://via.placeholder.com/40x60?text=No+Cover";

                    const item = document.createElement("div");
                    item.className = "api-book-item";
                    item.innerHTML = `
                        <img src="${cover}" alt="${title}">
                        <div>
                            <div style="font-weight:600; font-size:0.9rem;">${title}</div>
                            <div style="font-size:0.8rem; color:#6F4E37;">${author}</div>
                        </div>
                    `;

                    item.addEventListener("click", () => {
                        selectedBookData = { title, author, openLibraryId, isbn: doc.isbn ? doc.isbn[0] : "" };
                        selectedPreview.innerHTML = `
                            <img src="${cover}" alt="${title}">
                            <div>
                                <div style="font-weight:600;">${title}</div>
                                <div style="font-size:0.85rem; color:#6F4E37;">${author}</div>
                            </div>
                        `;
                        step1.style.display = "none";
                        step2.style.display = "block";
                    });

                    modalResults.appendChild(item);
                });

            } catch (err) {
                console.error("Modal Search Error:", err);
                modalResults.innerHTML = "<p style='font-size: 0.85rem; color:red;'>Search failed. Try again.</p>";
            }
        });
    }

    if (btnBack) {
        btnBack.addEventListener("click", () => {
            step1.style.display = "block";
            step2.style.display = "none";
        });
    }

    const listingType = document.getElementById("listing-type");
    if (listingType) {
        listingType.addEventListener("change", (e) => {
            const priceInput = document.getElementById("listing-price");
            if (priceInput) {
                priceInput.value = (e.target.value === "Lend") ? "Free" : "₹150";
            }
        });
    }

    // Submit New Listing
    if (step2) {
        step2.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!selectedBookData) return;

            const newListing = {
                openLibraryId: selectedBookData.openLibraryId,
                isbn: selectedBookData.isbn,
                title: selectedBookData.title,
                author: selectedBookData.author,
                genre: document.getElementById("listing-genre").value,
                listerName: document.getElementById("lister-name").value,
                listerYear: document.getElementById("lister-year").value,
                type: document.getElementById("listing-type").value,
                price: document.getElementById("listing-price").value,
                condition: document.getElementById("listing-condition").value,
                phone: document.getElementById("lister-phone").value
            };

            CampusDB.addListing(newListing);

            // Re-render shelf based on which page we are on
            if (isHomepage) {
                renderShelf(CampusDB.getAvailable(), 3);
            } else {
                renderShelf(CampusDB.getAvailable());
            }

            closeModal();
            alert("Your book has been published to the campus shelf!");
        });
    }
});
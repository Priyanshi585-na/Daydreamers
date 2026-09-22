(function () {
    const coverCache = {};
    const fallbackCover = "https://placehold.co/128x192/fff8f0/6f4e37?text=No+Cover";

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    async function fetchCoverUrl(openLibraryId, isbn) {
        const key = openLibraryId ? `olid:${openLibraryId}` : isbn ? `isbn:${isbn}` : "fallback";
        if (coverCache[key]) return coverCache[key];
        const url = openLibraryId
            ? `https://covers.openlibrary.org/b/olid/${openLibraryId}-M.jpg`
            : isbn
                ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
                : fallbackCover;
        coverCache[key] = url;
        return url;
    }

    function getResultsCountElement() {
        return document.getElementById("resultsCount") || document.getElementById("resultCount");
    }

    async function createBookCard(book, options = {}) {
        const coverUrl = await fetchCoverUrl(book.openLibraryId, book.isbn);
        const waMsg = encodeURIComponent(`Hi ${book.listerName}! I saw your listing for "${book.title}" on Daydreamers. Is it still available to ${book.type.toLowerCase()}?`);
        const waUrl = `https://wa.me/${book.phone}?text=${waMsg}`;
        const isSold = book.status === "sold";
        const stampText = isSold ? "Handed Over" : book.type;
        const priceText = book.price || "Free";

        const card = document.createElement("div");
        card.className = "book-card";
        card.style.cssText = "background:#FFF8F0;border:1px solid #E8DCCB;border-radius:10px;padding:14px;display:flex;flex-direction:column;box-shadow:0 2px 6px rgba(111,78,55,0.08);";
        card.innerHTML = `
            <img class="cover-img" src="${coverUrl}" alt="${escapeHtml(book.title)}" style="border-radius:6px; border:1px solid #E8DCCB;" onerror="this.onerror=null; this.src='${fallbackCover}';" />
            <span class="stamp ${isSold ? "reserved" : "available"}" style="align-self:flex-start; margin-top:8px; color:#fff; background:#6F4E37; padding:2px 8px; border-radius:20px; font-size:0.72rem; font-weight:600; letter-spacing:0.3px; text-transform:uppercase;">${escapeHtml(stampText)}</span>
            <div class="book-title" style="font-weight:600; color:#3E2C22; margin-top:8px;">${escapeHtml(book.title)}</div>
            <div class="book-author" style="font-size:0.85rem; color:#8B6F5C;">${escapeHtml(book.author)}</div>
            <div class="tag-row" style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; justify-content:flex-start;">
                <span class="tag" style="background:#EFE3D3; color:#6F4E37; padding:3px 10px; border-radius:20px; font-size:0.78rem;">${escapeHtml(book.condition)}</span>
                <span class="tag" style="background:${priceText === "Free" ? "#DDEBD8" : "#F3E0C7"}; color:${priceText === "Free" ? "#3F6B3C" : "#8A5A22"}; padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;">${escapeHtml(priceText)}</span>
            </div>
            <div class="card-footer" style="margin-top:auto; padding-top:12px; border-top:1px solid #EFE3D3; display:flex; flex-direction:column; gap:10px;">
                <div class="lister-row" style="display:flex; align-items:baseline; gap:6px; flex-wrap:wrap;"><span class="lister-name" style="font-size:0.88rem; font-weight:600; color:#3E2C22;">${escapeHtml(book.listerName)}</span><span class="lister-year" style="font-size:0.78rem; color:#A38B72; white-space:nowrap;">· ${escapeHtml(book.listerYear)}</span></div>
                ${options.showActions ? `<button class="mark-sold-btn" data-id="${book.id}" style="background:#2E7D32; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer;">Mark Handed Over</button><button class="delete-listing-btn" data-id="${book.id}" style="background:transparent; color:#A3492C; border:1px solid #A3492C; padding:8px 12px; border-radius:6px; cursor:pointer;">Delete</button>` : `<a href="${waUrl}" target="_blank" rel="noopener" class="card-cta" style="display:block; width:100%; box-sizing:border-box; text-align:center; padding:8px 12px; background:#6F4E37; color:#fff; text-decoration:none; border-radius:6px; font-weight:600; font-size:0.9rem;">WhatsApp Lister</a>`}
            </div>`;

        if (options.showActions) {
            card.querySelector(".mark-sold-btn")?.addEventListener("click", () => {
                CampusDB.markAsSold(book.id);
                renderMyListings();
            });
            card.querySelector(".delete-listing-btn")?.addEventListener("click", () => {
                if (confirm(`Remove ${book.title} from your listings?`)) {
                    CampusDB.deleteListing(book.id);
                    renderMyListings();
                }
            });
        }
        return card;
    }

    async function renderShelf(listings, limit = null, options = {}) {
        const targetId = options.targetId || "gridContainer";
        const gridContainer = document.getElementById(targetId) || document.getElementById("gridContainer") || document.getElementById("homepage-recent-grid");
        const resultsCount = getResultsCountElement();
        if (!gridContainer) return;

        gridContainer.innerHTML = `<div style="grid-column:1/-1; display:flex; flex-direction:column; align-items:center; padding:30px 0;"><div class="spinner"></div><p style="margin-top:10px; color:#8B6F5C; font-size:0.9rem;">Brewing your campus shelf...</p></div>`;
        if (!listings || listings.length === 0) {
            gridContainer.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#6F4E37;">${options.emptyMessage || "No campus books available right now!"}</p>`;
            if (resultsCount) resultsCount.textContent = "Showing 0 books";
            return;
        }

        const displayListings = limit ? listings.slice(0, limit) : listings;
        if (resultsCount) resultsCount.textContent = `Showing ${displayListings.length} campus book${displayListings.length > 1 ? "s" : ""}`;
        gridContainer.innerHTML = "";
        for (const book of displayListings) gridContainer.appendChild(await createBookCard(book, options));
    }

    async function renderMyListings() {
        if (!document.getElementById("my-listings-grid")) return;
        await renderShelf(CampusDB.getMyListings(), null, { targetId: "my-listings-grid", showActions: true, emptyMessage: "You haven’t listed any books yet." });
    }

    window.Daydreamers = window.Daydreamers || {};
    window.Daydreamers.shelf = { renderShelf, renderMyListings };
}());

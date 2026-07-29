const coverCache = {};
const AUTH_STORAGE_KEY = "daydreamers_auth_users_v1";
const CURRENT_USER_KEY = "daydreamers_current_user_v1";

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function fetchCoverUrl(openLibraryId, isbn) {
    const candidateKeys = [];
    if (openLibraryId) candidateKeys.push(`olid:${openLibraryId}`);
    if (isbn) candidateKeys.push(`isbn:${isbn}`);

    for (const key of candidateKeys) {
        if (coverCache[key]) return coverCache[key];
    }

    const candidates = [];
    if (openLibraryId) candidates.push(`https://covers.openlibrary.org/b/olid/${openLibraryId}-M.jpg`);
    if (isbn) candidates.push(`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`);

    if (candidates.length > 0) {
        const selected = candidates[0];
        coverCache[candidateKeys[0]] = selected;
        return selected;
    }

    return "https://placehold.co/128x192/fff8f0/6f4e37?text=No+Cover";
}

function getResultsCountElement() {
    return document.getElementById("resultsCount") || document.getElementById("resultCount");
}

function getAuthUsers() {
    try {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!data) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify([]));
            return [];
        }
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Unable to read auth users:", error);
        return [];
    }
}

function saveAuthUsers(users) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(users));
}

function getCurrentUser() {
    try {
        const data = localStorage.getItem(CURRENT_USER_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error("Unable to read current user:", error);
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

function showAuthMessage(message, type = "error") {
    const box = document.getElementById("auth-message");
    if (!box) return;
    box.textContent = message;
    box.className = `auth-message ${type}`;
}

function handleAuthForms() {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("login-email")?.value.trim() || "";
            const password = document.getElementById("login-password")?.value || "";
            const users = getAuthUsers();
            const match = users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

            if (!match) {
                showAuthMessage("No matching account found. Try signing up first.", "error");
                return;
            }

            setCurrentUser(match);
            window.location.href = "home.html";
        });
    }

    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("signup-name")?.value.trim() || "";
            const email = document.getElementById("signup-email")?.value.trim() || "";
            const year = document.getElementById("signup-year")?.value || "";
            const password = document.getElementById("signup-password")?.value || "";
            const whatsapp = document.getElementById("pref-whatsapp")?.checked;
            const telegram = document.getElementById("pref-telegram")?.checked;
            const phone = document.getElementById("signup-phone")?.value.trim() || "";
            const telegramHandle = document.getElementById("signup-telegram")?.value.trim() || "";

            if (!name || !email || !password) {
                showAuthMessage("Please complete the required fields before creating your account.", "error");
                return;
            }

            const users = getAuthUsers();
            const alreadyExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
            if (alreadyExists) {
                showAuthMessage("That campus email is already registered. Try logging in instead.", "error");
                return;
            }

            const newUser = {
                id: `user-${Date.now()}`,
                name,
                email,
                year,
                password,
                contactMethod: whatsapp ? "whatsapp" : telegram ? "telegram" : "whatsapp",
                phone: whatsapp ? phone : "",
                telegramHandle: telegram ? telegramHandle : "",
                createdAt: new Date().toISOString()
            };

            users.push(newUser);
            saveAuthUsers(users);
            setCurrentUser(newUser);
            window.location.href = "home.html";
        });
    }
}

async function createBookCard(book, options = {}) {
    const coverUrl = await fetchCoverUrl(book.openLibraryId, book.isbn);
    const waMsg = encodeURIComponent(`Hi ${book.listerName}! I saw your listing for "${book.title}" on Daydreamers. Is it still available to ${book.type.toLowerCase()}?`);
    const waUrl = `https://wa.me/${book.phone}?text=${waMsg}`;
    const isSold = book.status === "sold";
    const stampText = isSold ? "Handed Over" : book.type;
    const stampClass = isSold ? "reserved" : "available";
    const priceText = book.price || "Free";
    const priceClass = priceText === "Free" ? "price-free" : "price-tag";

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
        <img class="cover-img" src="${coverUrl}" alt="${escapeHtml(book.title)}" style="border-radius:6px; border:1px solid #E8DCCB;" onerror="this.onerror=null; this.src='https://placehold.co/128x192/fff8f0/6f4e37?text=No+Cover';" />
        <span class="stamp ${stampClass}" style="align-self:flex-start; margin-top:8px; color:#fff; background:#6F4E37; padding:2px 8px; border-radius:20px; font-size:0.72rem; font-weight:600; letter-spacing:0.3px; text-transform:uppercase;">${escapeHtml(stampText)}</span>
        <div class="book-title" style="font-weight:600; color:#3E2C22; margin-top:8px;">${escapeHtml(book.title)}</div>
        <div class="book-author" style="font-size:0.85rem; color:#8B6F5C;">${escapeHtml(book.author)}</div>
        <div class="tag-row" style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; justify-content:flex-start;">
            <span class="tag" style="background:#EFE3D3; color:#6F4E37; padding:3px 10px; border-radius:20px; font-size:0.78rem;">${escapeHtml(book.condition)}</span>
            <span class="tag ${priceClass}" style="background:${priceText === "Free" ? "#DDEBD8" : "#F3E0C7"}; color:${priceText === "Free" ? "#3F6B3C" : "#8A5A22"}; padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;">${escapeHtml(priceText)}</span>
        </div>
        <div class="card-footer" style="margin-top:auto; padding-top:12px; border-top:1px solid #EFE3D3; display:flex; flex-direction:column; gap:10px;">
            <div class="lister-row" style="display:flex; align-items:baseline; gap:6px; flex-wrap:wrap;">
                <span class="lister-name" style="font-size:0.88rem; font-weight:600; color:#3E2C22;">${escapeHtml(book.listerName)}</span>
                <span class="lister-year" style="font-size:0.78rem; color:#A38B72; white-space:nowrap;">· ${escapeHtml(book.listerYear)}</span>
            </div>
            ${options.showActions ? `
                <button class="mark-sold-btn" data-id="${book.id}" style="background:#2E7D32; color:#fff; border:none; padding:8px 12px; border-radius:6px; cursor:pointer;">Mark Handed Over</button>
                <button class="delete-listing-btn" data-id="${book.id}" style="background:transparent; color:#A3492C; border:1px solid #A3492C; padding:8px 12px; border-radius:6px; cursor:pointer;">Delete</button>
            ` : `<a href="${waUrl}" target="_blank" rel="noopener" class="card-cta" style="display:block; width:100%; box-sizing:border-box; text-align:center; padding:8px 12px; background:#6F4E37; color:#fff; text-decoration:none; border-radius:6px; font-weight:600; font-size:0.9rem; transition: background 0.15s ease;" onmouseover="this.style.background='#5A3E2C'" onmouseout="this.style.background='#6F4E37'">WhatsApp Lister</a>`}
        </div>
    `;

    if (options.showActions) {
        const markSoldBtn = card.querySelector(".mark-sold-btn");
        const deleteBtn = card.querySelector(".delete-listing-btn");

        markSoldBtn?.addEventListener("click", () => {
            CampusDB.markAsSold(book.id);
            renderMyListings();
        });

        deleteBtn?.addEventListener("click", () => {
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

    gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; padding: 30px 0;">
            <div class="spinner"></div>
            <p style="margin-top: 10px; color: #8B6F5C; font-size: 0.9rem;">Brewing your campus shelf...</p>
        </div>
    `;

    if (!listings || listings.length === 0) {
        gridContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#6F4E37;">${options.emptyMessage || "No campus books available right now!"}</p>`;
        if (resultsCount) resultsCount.textContent = "Showing 0 books";
        return;
    }

    const displayListings = limit ? listings.slice(0, limit) : listings;

    if (resultsCount) {
        resultsCount.textContent = `Showing ${displayListings.length} campus book${displayListings.length > 1 ? "s" : ""}`;
    }

    gridContainer.innerHTML = "";

    for (const book of displayListings) {
        const card = await createBookCard(book, options);
        gridContainer.appendChild(card);
    }
}

async function renderMyListings() {
    const myGrid = document.getElementById("my-listings-grid");
    if (!myGrid) return;

    const myListings = CampusDB.getMyListings();
    await renderShelf(myListings, null, {
        targetId: "my-listings-grid",
        showActions: true,
        emptyMessage: "You haven’t listed any books yet."
    });
}

document.addEventListener("DOMContentLoaded", () => {
    handleAuthForms();

    const isHomepage = document.getElementById("homepage-recent-grid") !== null;
    const isMyListingsPage = document.getElementById("my-listings-grid") !== null;

    if (isHomepage) {
        renderShelf(CampusDB.getAvailable(), 8);
    } else if (isMyListingsPage) {
        renderMyListings();
    } else {
        renderShelf(CampusDB.getAvailable());
    }

    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const clearFilters = document.getElementById("clear-filters");
    const genreFilters = document.querySelectorAll(".genre-filter");
    const conditionFilters = document.querySelectorAll(".condition-filter");
    const typeFilters = document.querySelectorAll(".type-filter");
    const priceFilters = document.querySelectorAll(".price-filter");
    const heroSearchInput = document.getElementById("hero-search-input");
    const heroSearchBtn = document.getElementById("hero-search-btn");
    const browseNowBtn = document.getElementById("browse-now-btn");

    function applyBrowseFilters() {
        const text = searchInput ? searchInput.value : "";
        const activeGenres = Array.from(genreFilters).filter(cb => cb.checked).map(cb => cb.value);
        const activeConditions = Array.from(conditionFilters).filter(cb => cb.checked).map(cb => cb.value);
        const activeTypes = Array.from(typeFilters).filter(cb => cb.checked).map(cb => cb.value);
        const activePrices = Array.from(priceFilters).filter(cb => cb.checked).map(cb => cb.value);
        const filtered = CampusDB.query({ text, genre: activeGenres, condition: activeConditions, type: activeTypes, price: activePrices });
        renderShelf(filtered);
    }

    if (searchBtn) searchBtn.addEventListener("click", applyBrowseFilters);
    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") applyBrowseFilters();
        });

        const params = new URLSearchParams(window.location.search);
        const initialSearch = params.get("search") || "";
        if (initialSearch) {
            searchInput.value = initialSearch;
            applyBrowseFilters();
        }
    }

    genreFilters.forEach(cb => {
        cb.addEventListener("change", applyBrowseFilters);
    });

    [...conditionFilters, ...typeFilters, ...priceFilters].forEach(cb => {
        cb.addEventListener("change", applyBrowseFilters);
    });

    if (clearFilters) {
        clearFilters.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            genreFilters.forEach(cb => cb.checked = false);
            conditionFilters.forEach(cb => cb.checked = false);
            typeFilters.forEach(cb => cb.checked = false);
            priceFilters.forEach(cb => cb.checked = false);
            renderShelf(CampusDB.getAvailable());
        });
    }

    if (browseNowBtn) {
        browseNowBtn.addEventListener("click", () => {
            window.location.href = "browse.html";
        });
    }

    if (heroSearchBtn && heroSearchInput) {
        const launchSearch = () => {
            const query = heroSearchInput.value.trim();
            const target = query ? `browse.html?search=${encodeURIComponent(query)}` : "browse.html";
            window.location.href = target;
        };

        heroSearchBtn.addEventListener("click", launchSearch);
        heroSearchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") launchSearch();
        });
    }

    const modal = document.getElementById("list-modal");
    const modalClose = document.getElementById("modal-close");
    const step1 = document.getElementById("modal-step-1");
    const step2 = document.getElementById("modal-step-2");
    const modalSearchInput = document.getElementById("modal-search-input");
    const modalSearchBtn = document.getElementById("modal-search-btn");
    const modalResults = document.getElementById("modal-search-results");
    const selectedPreview = document.getElementById("selected-preview");
    const btnBack = document.getElementById("btn-back");

    let selectedBookData = null;

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
        if (selectedPreview) selectedPreview.innerHTML = "";
    }

    document.querySelectorAll(".list-book-btn").forEach(button => {
        button.addEventListener("click", () => {
            if (modal) modal.classList.add("active");
        });
    });

    if (modalClose) modalClose.addEventListener("click", () => closeModal());

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeModal();
        });
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

    if (step2) {
        step2.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!selectedBookData) return;

            const currentUser = JSON.parse(localStorage.getItem("daydreamers_current_user_v1") || "null");
            const newListing = {
                openLibraryId: selectedBookData.openLibraryId,
                isbn: selectedBookData.isbn,
                title: selectedBookData.title,
                author: selectedBookData.author,
                genre: document.getElementById("listing-genre").value,
                listerName: document.getElementById("lister-name").value,
                listerEmail: currentUser?.email || "",
                listerYear: document.getElementById("lister-year").value,
                type: document.getElementById("listing-type").value,
                price: document.getElementById("listing-price").value,
                condition: document.getElementById("listing-condition").value,
                phone: document.getElementById("lister-phone").value
            };

            CampusDB.addListing(newListing);

            if (isHomepage) {
                renderShelf(CampusDB.getAvailable(), 8);
            } else if (isMyListingsPage) {
                renderMyListings();
            } else {
                renderShelf(CampusDB.getAvailable());
            }

            closeModal();
            alert("Your book has been published to the campus shelf!");
        });
    }
});
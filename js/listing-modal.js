(function () {
    function initListingModal() {
        const modal = document.getElementById("list-modal");
        const step1 = document.getElementById("modal-step-1");
        const step2 = document.getElementById("modal-step-2");
        if (!modal || !step1 || !step2) return;

        const modalResults = document.getElementById("modal-search-results");
        const searchInput = document.getElementById("modal-search-input");
        const selectedPreview = document.getElementById("selected-preview");
        let selectedBookData = null;

        const reset = () => {
            modal.classList.remove("active");
            step1.style.display = "block";
            step2.style.display = "none";
            searchInput.value = "";
            modalResults.innerHTML = "";
            selectedPreview.innerHTML = "";
            selectedBookData = null;
            step2.reset();
        };
        const showStep = step => {
            step1.style.display = step === 1 ? "block" : "none";
            step2.style.display = step === 2 ? "block" : "none";
        };

        document.querySelectorAll(".list-book-btn").forEach(button => button.addEventListener("click", () => modal.classList.add("active")));
        document.getElementById("modal-close")?.addEventListener("click", reset);
        modal.addEventListener("click", event => { if (event.target === modal) reset(); });
        document.getElementById("btn-back")?.addEventListener("click", () => showStep(1));

        document.getElementById("modal-search-btn")?.addEventListener("click", async () => {
            const query = searchInput.value.trim();
            if (!query) return;
            modalResults.innerHTML = "<p>Searching Library...</p>";
            try {
                const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
                const data = await response.json();
                modalResults.innerHTML = "";
                if (!data.docs?.length) { modalResults.innerHTML = "<p>No matching books found.</p>"; return; }
                data.docs.forEach(doc => {
                    const title = doc.title || "Untitled";
                    const author = doc.author_name?.[0] || "Unknown Author";
                    const openLibraryId = doc.key?.replace("/works/", "") || "OL1W";
                    const cover = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg` : "https://via.placeholder.com/40x60?text=No+Cover";
                    console.log("COVER ID FROM API:", doc.cover_i);
                    const item = document.createElement("div");
                    item.className = "api-book-item";
                    item.innerHTML = `<img src="${cover}" alt="${title}"><div><div style="font-weight:600; font-size:0.9rem;">${title}</div><div style="font-size:0.8rem; color:#6F4E37;">${author}</div></div>`;
                    item.addEventListener("click", () => {
                        selectedBookData = {
                            title,
                            author,
                            openLibraryId,
                            coverId: doc.cover_i || null,
                            isbn: doc.isbn?.[0] || ""
                        };
                        selectedPreview.innerHTML = `<img src="${cover}" alt="${title}"><div><div style="font-weight:600;">${title}</div><div style="font-size:0.85rem; color:#6F4E37;">${author}</div></div>`;
                        showStep(2);
                    });
                    modalResults.appendChild(item);
                });
            } catch (error) {
                console.error("Modal Search Error:", error);
                modalResults.innerHTML = "<p style='color:red;'>Search failed. Try again.</p>";
            }
        });

        document.getElementById("listing-type")?.addEventListener("change", event => {
            const priceInput = document.getElementById("listing-price");
            if (priceInput) priceInput.value = event.target.value === "Lend" ? "Free" : "₹150";
        });

        step2.addEventListener("submit", event => {
            event.preventDefault();
            if (!selectedBookData) return;
            const currentUser = window.Daydreamers.auth.getCurrentUser();

            console.log("SELECTED BOOK BEFORE SAVE:", selectedBookData);

            CampusDB.addListing({
                ...selectedBookData,
                genre: document.getElementById("listing-genre").value,
                listerName: document.getElementById("lister-name").value,
                listerEmail: currentUser?.email || "",
                listerYear: document.getElementById("lister-year").value,
                type: document.getElementById("listing-type").value,
                price: document.getElementById("listing-price").value,
                condition: document.getElementById("listing-condition").value,
                phone: document.getElementById("lister-phone").value
            });
            const { renderShelf, renderMyListings } = window.Daydreamers.shelf;
            if (document.getElementById("homepage-recent-grid")) renderShelf(CampusDB.getAvailable(), 8);
            else if (document.getElementById("my-listings-grid")) renderMyListings();
            else renderShelf(CampusDB.getAvailable());
            reset();
            alert("Your book has been published to the campus shelf!");
        });
    }

    window.Daydreamers = window.Daydreamers || {};
    window.Daydreamers.listingModal = { initListingModal };
}());

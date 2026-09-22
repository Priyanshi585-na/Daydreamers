document.addEventListener("DOMContentLoaded", () => {
    const { auth, browse, shelf, listingModal } = window.Daydreamers;

    auth.handleAuthForms();

    const isHomepage = document.getElementById("homepage-recent-grid") !== null;
    const isMyListingsPage = document.getElementById("my-listings-grid") !== null;

    if (isHomepage) {
        shelf.renderShelf(CampusDB.getAvailable(), 8);
    } else if (isMyListingsPage) {
        shelf.renderMyListings();
    } else {
        shelf.renderShelf(CampusDB.getAvailable());
    }

    browse.initBrowse();
    listingModal.initListingModal();

    const heroSearchInput = document.getElementById("hero-search-input");
    const heroSearchBtn = document.getElementById("hero-search-btn");
    const launchSearch = () => {
        const query = heroSearchInput?.value.trim() || "";
        window.location.href = query ? `browse.html?search=${encodeURIComponent(query)}` : "browse.html";
    };

    heroSearchBtn?.addEventListener("click", launchSearch);
    heroSearchInput?.addEventListener("keydown", event => {
        if (event.key === "Enter") launchSearch();
    });

    document.getElementById("browse-now-btn")?.addEventListener("click", () => {
        window.location.href = "browse.html";
    });
});

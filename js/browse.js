(function () {
    function initBrowse() {
        const { renderShelf } = window.Daydreamers.shelf;
        const searchInput = document.getElementById("search-input");
        const searchBtn = document.getElementById("search-btn");
        const clearFilters = document.getElementById("clear-filters");
        const filters = {
            genre: document.querySelectorAll(".genre-filter"),
            condition: document.querySelectorAll(".condition-filter"),
            type: document.querySelectorAll(".type-filter"),
            price: document.querySelectorAll(".price-filter")
        };

        const applyFilters = () => {
            const selected = Object.fromEntries(Object.entries(filters).map(([key, controls]) => [key, Array.from(controls).filter(control => control.checked).map(control => control.value)]));
            renderShelf(CampusDB.query({ text: searchInput?.value || "", ...selected }));
        };

        searchBtn?.addEventListener("click", applyFilters);
        searchInput?.addEventListener("keyup", event => {
            if (event.key === "Enter") applyFilters();
        });
        Object.values(filters).forEach(controls => controls.forEach(control => control.addEventListener("change", applyFilters)));

        clearFilters?.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            Object.values(filters).forEach(controls => controls.forEach(control => control.checked = false));
            renderShelf(CampusDB.getAvailable());
        });

        const initialSearch = new URLSearchParams(window.location.search).get("search") || "";
        if (initialSearch && searchInput) {
            searchInput.value = initialSearch;
            applyFilters();
        }
    }

    window.Daydreamers = window.Daydreamers || {};
    window.Daydreamers.browse = { initBrowse };
}());

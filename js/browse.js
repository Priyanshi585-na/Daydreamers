import { getBooks } from "./db.js"

let allBooks = await getBooks();

const book_grid = document.getElementById('gridContainer');
const count = document.getElementById("resultsCount");

function createBookCard(book) {
    const card = document.createElement("div");
    card.className = "book-card";
    card.style.cssText = "background:#FFF8F0;border:1px solid #E8DCCB;border-radius:10px;padding:14px;display:flex;flex-direction:column;box-shadow:0 2px 6px rgba(111,78,55,0.08);";
    card.innerHTML = `
    <img class="cover-img" src="${`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}" alt="${book.title}" style="border-radius:6px; border:1px solid #E8DCCB;" />
    <span class="stamp ${book.isSold ? "reserved" : "available"}" style="align-self:flex-start; margin-top:8px; color:#fff; background:#6F4E37; padding:2px 8px; border-radius:20px; font-size:0.72rem; font-weight:600; letter-spacing:0.3px; text-transform:uppercase;">${book.stampText}</span>
    <div class="book-title" style="font-weight:600; color:#3E2C22; margin-top:8px;">${book.title}</div>
    <div class="book-author" style="font-size:0.85rem; color:#8B6F5C;">${book.author}</div>
    <div class="tag-row" style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; justify-content:flex-start;">
    <span class="tag" style="background:#EFE3D3; color:#6F4E37; padding:3px 10px; border-radius:20px; font-size:0.78rem;">${book.condition}</span>
    <span class="tag" style="background:${book.priceText === "Free" ? "#DDEBD8" : "#F3E0C7"}; color:${book.priceText === "Free" ? "#3F6B3C" : "#8A5A22"}; padding:3px 10px; border-radius:20px; font-size:0.78rem; font-weight:600;">${book.priceText}</span>
    </div>
    <div class="card-footer" style="margin-top:auto; padding-top:12px; border-top:1px solid #EFE3D3; display:flex; flex-direction:column; gap:10px;">
    <div class="lister-row" style="display:flex; align-items:baseline; gap:6px; flex-wrap:wrap;"><span class="lister-name" style="font-size:0.88rem; font-weight:600; color:#3E2C22;">${book.listerName}</span><span class="lister-year" style="font-size:0.78rem; color:#A38B72; white-space:nowrap;">· ${book.listerYear}</span></div>
    
    <a class="contact-btn" href="https://wa.me/${book.phone}" target="_blank" rel="noopener noreferrer">
        <i class="fa-brands fa-whatsapp"></i> Contact Lister
    </a>

    `
    return card;
}


if (sessionStorage.getItem("selectedCategory")) {
    const query = sessionStorage.getItem("selectedCategory");

    const results = allBooks.filter(book =>
        book.category?.toLowerCase() === query
    );

    book_grid.innerHTML = "";

    if (results.length === 0) {
        book_grid.innerHTML =
            "<h1>No books listed in this category</h1>";
    } else {
        results.forEach(listing => {
            book_grid.appendChild(createBookCard(listing));
        });
    }

    count.textContent = `Showing ${results.length} books`;
    sessionStorage.removeItem("selectedCategory");
}



const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener("click", function () {
    const query = searchInput.value.trim().toLowerCase();

    const results = allBooks.filter(book =>
        book.author.toLowerCase().includes(query) ||
        book.title.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
    );

    book_grid.innerHTML = "";

    if (results.length === 0) {
        book_grid.innerHTML = "<h3>No such book listed</h3>";
    } else {
        results.forEach(listing => {
            book_grid.appendChild(createBookCard(listing));
        });
    }

    count.textContent = `Showing ${results.length} books`;
});



const filterToggle = document.getElementById("filter-toggle");
const filters = document.querySelector(".filters");

filterToggle.addEventListener("click", () => {
    filters.classList.toggle("expanded");
});

const filterCheckboxes = document.querySelectorAll(
    ".genre-filter, .condition-filter, .price-filter"
);

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function () {

        const selectedGenres = [...document.querySelectorAll(".genre-filter:checked")]
            .map(cb => cb.value);

        const selectedConditions = [...document.querySelectorAll(".condition-filter:checked")]
            .map(cb => cb.value);

        const selectedPrices = [...document.querySelectorAll(".price-filter:checked")]
            .map(cb => cb.value);


        const results = allBooks.filter(book =>
            (selectedGenres.length === 0 || selectedGenres.includes(book.genre)) &&
            (selectedConditions.length === 0 || selectedConditions.includes(book.condition)) &&
            (selectedPrices.length === 0 || selectedPrices.includes(book.priceText))
        );

        book_grid.innerHTML = "";

        if (results.length === 0) {
            book_grid.innerHTML = "<h3>No books match your filters.</h3>";
        } else {
            results.forEach(book => {
                book_grid.appendChild(createBookCard(book));
            });
        }

        count.textContent = `Showing ${results.length} books`;
    });
});

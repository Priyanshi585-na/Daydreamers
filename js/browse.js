
import { getBooks } from "./db.js";

const allBooks = await getBooks();

const bookGrid = document.getElementById("gridContainer");
const count = document.getElementById("resultsCount");

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

const filterToggle = document.getElementById("filter-toggle");
const filters = document.querySelector(".filters");

let searchQuery = "";

function createBookCard(book) {
    const card = document.createElement("div");
    card.className = "book-card";

    card.style.cssText = `
        background: #FFF8F0;
        border: 1px solid #E8DCCB;
        border-radius: 10px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        box-shadow: 0 2px 6px rgba(111,78,55,0.08);
    `;

    const coverUrl = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "";

    const author = book.author || "Unknown author";
    const title = book.title || "Untitled";
    const condition = book.condition || "Not specified";
    const price = book.priceText || "Free";
    const listerName = book.listerName || "Anonymous";
    const listerYear = book.listerYear || "";
    const phone = book.phone || "";

    card.innerHTML = `
        <img
            class="cover-img"
            src="${coverUrl}"
            alt="${title}"
            style="border-radius:6px; border:1px solid #E8DCCB;"
        />

        <span
            class="stamp ${book.isSold ? "reserved" : "available"}"
            style="align-self:flex-start; margin-top:8px; color:#fff;
            background:#6F4E37; padding:2px 8px; border-radius:20px;
            font-size:0.72rem; font-weight:600; letter-spacing:0.3px;
            text-transform:uppercase;"
        >${book.stampText || "Available"}</span>

        <div class="book-title"
            style="font-weight:600; color:#3E2C22; margin-top:8px;">
            ${title}
        </div>

        <div class="book-author"
            style="font-size:0.85rem; color:#8B6F5C;">
            ${author}
        </div>

        <div class="tag-row"
            style="display:flex; gap:6px; margin-top:8px;
            flex-wrap:wrap; justify-content:flex-start;">

            <span class="tag"
                style="background:#EFE3D3; color:#6F4E37;
                padding:3px 10px; border-radius:20px; font-size:0.78rem;">
                ${condition}
            </span>

            <span class="tag"
                style="background:${price === "Free" ? "#DDEBD8" : "#F3E0C7"};
                color:${price === "Free" ? "#3F6B3C" : "#8A5A22"};
                padding:3px 10px; border-radius:20px;
                font-size:0.78rem; font-weight:600;">
                ${price}
            </span>
        </div>

        <div class="card-footer"
            style="margin-top:auto; padding-top:12px;
            border-top:1px solid #EFE3D3; display:flex;
            flex-direction:column; gap:10px;">

            <div class="lister-row"
                style="display:flex; align-items:baseline;
                gap:6px; flex-wrap:wrap;">

                <span class="lister-name"
                    style="font-size:0.88rem; font-weight:600; color:#3E2C22;">
                    ${listerName}
                </span>

                <span class="lister-year"
                    style="font-size:0.78rem; color:#A38B72; white-space:nowrap;">
                    ${listerYear ? "· " + listerYear : ""}
                </span>
            </div>

            ${
                phone
                    ? `<a class="contact-btn"
                        href="https://wa.me/${phone.replace(/\D/g, "")}"
                        target="_blank"
                        rel="noopener noreferrer">
                        <i class="fa-brands fa-whatsapp"></i>
                        Contact Lister
                    </a>`
                    : `<span>Contact details unavailable</span>`
            }
        </div>
    `;

    const cover = card.querySelector(".cover-img");
    cover.addEventListener("error", () => {
        cover.style.display = "none";
    });

    return card;
}

function getSelectedValues(selector) {
    return [...document.querySelectorAll(`${selector}:checked`)]
        .map(checkbox => checkbox.value);
}

function renderBooks() {
    const selectedGenres = getSelectedValues(".genre-filter");
    const selectedConditions = getSelectedValues(".condition-filter");
    const selectedPrices = getSelectedValues(".price-filter");

    const query = searchQuery.toLowerCase();

    const results = allBooks.filter(book => {
        const title = (book.title || "").toLowerCase();
        const author = (book.author || "").toLowerCase();
        const genre = (book.genre || book.category || "").toLowerCase();

        const matchesSearch =
            !query ||
            title.includes(query) ||
            author.includes(query) ||
            genre.includes(query);

        const matchesGenre =
            selectedGenres.length === 0 ||
            selectedGenres.some(value =>
                value.toLowerCase() === genre
            );

        const matchesCondition =
            selectedConditions.length === 0 ||
            selectedConditions.includes(book.condition);

        const matchesPrice =
            selectedPrices.length === 0 ||
            selectedPrices.includes(book.priceText);

        return (
            matchesSearch &&
            matchesGenre &&
            matchesCondition &&
            matchesPrice
        );
    });

    bookGrid.innerHTML = "";

    if (results.length === 0) {
        bookGrid.innerHTML = "<h3>No books match your search or filters.</h3>";
    } else {
        results.forEach(book => {
            bookGrid.appendChild(createBookCard(book));
        });
    }

    count.textContent = `Showing ${results.length} books`;
}

const selectedCategory = sessionStorage.getItem("selectedCategory");

if (selectedCategory) {
    const category = selectedCategory.toLowerCase();

    const matchingCheckbox = [
        ...document.querySelectorAll(".genre-filter")
    ].find(checkbox => checkbox.value.toLowerCase() === category);

    if (matchingCheckbox) {
        matchingCheckbox.checked = true;
    } else {
        searchQuery = "";
    }
}

sessionStorage.removeItem("selectedCategory");

searchBtn.addEventListener("click", () => {
    searchQuery = searchInput.value.trim();
    renderBooks();
});

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        event.preventDefault();
        searchQuery = searchInput.value.trim();
        renderBooks();
    }
});


document.querySelectorAll(
    ".genre-filter, .condition-filter, .price-filter"
).forEach(checkbox => {
    checkbox.addEventListener("change", renderBooks);
});

if (filterToggle && filters) {
    filterToggle.addEventListener("click", () => {
        filters.classList.toggle("expanded");
    });
}

renderBooks();

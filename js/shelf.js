import {
    addBook,
    getBooks,
    updateBook,
    deleteBook,
    getBook
} from "./db.js"

document.getElementById("browse-now-btn").addEventListener("click", function () {
    window.location.href = "browse.html";
});

const allBooks = await getBooks();

const book_grid = document.getElementById('homepage-recent-grid');

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
    `
    return card;
}

allBooks.slice(0, 4).forEach(listing => {
    const card = createBookCard(listing);
    book_grid.appendChild(card);
});
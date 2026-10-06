import {
    addBook,
    getBooks,
    updateBook,
    deleteBook,
    getBook
} from "./db.js"


const user = localStorage.getItem("username");

const heading = document.getElementsByClassName("username")[0];
heading.innerHTML = `Hi, ${user}`


const allBooks = await getBooks();
const myBooks = allBooks.filter(book => book.listerName === user);

let editingBookId = null;

const book_grid = document.getElementById('my-listings-grid');

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
    
    <div class="listing-actions">
    <button class="edit-btn btn-primary" data-id="${book.id}">Edit</button>
    <button class="delete-btn btn-secondary" data-id="${book.id}">Lent</button>
    </div>

    `
    return card;
}

myBooks.forEach(listing => {
    const card = createBookCard(listing);
    book_grid.appendChild(card);
})

document.addEventListener("click", async function(event){
    if(event.target.classList.contains("delete-btn")){
        const id = Number(event.target.dataset.id);
        await deleteBook(id);

        event.target.closest(".book-card").remove();
    }
})


document.addEventListener("click", async function (event) {

    if (event.target.classList.contains("edit-btn")) {

        const id = Number(event.target.dataset.id);

        const book = await getBook(id);

        editingBookId = id;

        document.getElementById("edit-condition").value = book.condition;
        document.getElementById("edit-price").value = book.priceText;

        document.getElementById("edit-availability").value =
            book.isSold ? "reserved" : "available";

        document.getElementById("edit-modal").style.display = "block";
    }
});

document.getElementById("edit-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const book = await getBook(editingBookId);

    book.condition = document.getElementById("edit-condition").value;
    book.priceText = document.getElementById("edit-price").value;

    const availability =
        document.getElementById("edit-availability").value;

    book.isSold = availability === "reserved";
    book.stampText = book.isSold ? "Reserved" : "Available";

    await updateBook(book);

    document.getElementById("edit-modal").style.display = "none";

    location.reload();
});

document.getElementById("cancel-edit").addEventListener("click", function () {
    document.getElementById("edit-modal").style.display = "none";
});

document.getElementById("edit-modal-close").addEventListener("click", function () {
    document.getElementById("edit-modal").style.display = "none";
});
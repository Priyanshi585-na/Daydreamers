import { addBook } from "./db.js";

const modal = document.getElementById("list-modal");
const closebtn = document.getElementById("modal-close");
const backBtn = document.getElementById("btn-back");

const searchbtn = document.getElementById("modal-search-btn");
const searchResults = document.getElementById("modal-search-results");
const searchInput = document.getElementById("modal-search-input");

const step1 = document.getElementById("modal-step-1")
const step2 = document.getElementById("modal-step-2")

const bookPreview = document.getElementById("selected-preview");

let selectedBook = null;


function selectBook(book) {

    selectedBook = book;

    step1.style.display = "none";
    step2.style.display = "block";

    bookPreview.innerHTML = `
    <img src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg" alt="${book.title}" class="search-result-cover">

    <h3>${book.title}</h3>
    <h4>A book by ${book.author_name ? book.author_name[0] : "Unknown author"}</h4>
    `
}



searchbtn.addEventListener("click", async function () {
    const query = searchInput.value.trim();

    searchResults.innerHTML = "Searching through the shelf...";

    const books = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=5`);
    const data = await books.json();

    searchResults.innerHTML = "";

    data.docs.forEach(book => {
        const result = document.createElement("div");
        result.className = "search-result";

        result.innerHTML = `
    <img 
        src="https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg"
        alt="${book.title}"
        class="search-result-cover"
    >

    <div class="search-result-info">
        <strong>${book.title}</strong>
        <p>${book.author_name ? book.author_name[0] : "Unknown author"}</p>
    </div>

    <button type="button" class="search-select-btn">Select</button>
`;

        result.querySelector("button").addEventListener("click", function () {
            selectBook(book);
        });

        searchResults.appendChild(result);
    })
})



step2.addEventListener("submit", async function (event) {
    event.preventDefault();

    const book = {
        cover_i: selectedBook.cover_i,
        title: selectedBook.title,
        author: selectedBook.author_name
            ? selectedBook.author_name[0]
            : "Unknown author",

        listerName: document.getElementById("lister-name").value,
        listerYear: document.getElementById("lister-year").value,

        genre: document.getElementById("listing-genre").value,
        listingType: document.getElementById("listing-type").value,
        priceText: document.getElementById("listing-price").value,
        condition: document.getElementById("listing-condition").value,

        phone: document.getElementById("lister-phone").value,

        isSold: false,
        stampText: "Available"
    };

    await addBook(book);

    modal.style.display = "none";
    step2.reset();
    bookPreview.innerHTML = "";
    selectedBook = null;
    step1.style.display = "block";
    step2.style.display = "none";

});


const listBtns = document.querySelectorAll(".list-book-btn");

listBtns.forEach(function(button) {
    button.addEventListener("click", function() {
        modal.style.display = "flex";
    });
});

closebtn.addEventListener("click", function () {
    modal.style.display = "none";
})


backBtn.addEventListener("click", function () {
    step2.style.display = "none";
    step1.style.display = "block";

    selectedBook = null;
});
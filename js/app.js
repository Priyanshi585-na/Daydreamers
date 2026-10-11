localStorage.setItem("username", "Priyanshi")

document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        sessionStorage.setItem(
            "selectedCategory",
            card.textContent.trim().toLowerCase()
        );

        window.location.href = "browse.html";
    });
});

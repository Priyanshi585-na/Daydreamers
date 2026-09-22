(function () {
    const AUTH_STORAGE_KEY = "daydreamers_auth_users_v1";
    const CURRENT_USER_KEY = "daydreamers_current_user_v1";

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

    function showAuthMessage(message, type = "error") {
        const box = document.getElementById("auth-message");
        if (!box) return;
        box.textContent = message;
        box.className = `auth-message ${type}`;
    }

    function handleAuthForms() {
        const loginForm = document.getElementById("login-form");
        const signupForm = document.getElementById("signup-form");

        loginForm?.addEventListener("submit", (event) => {
            event.preventDefault();
            const email = document.getElementById("login-email")?.value.trim() || "";
            const password = document.getElementById("login-password")?.value || "";
            const match = getAuthUsers().find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

            if (!match) {
                showAuthMessage("No matching account found. Try signing up first.", "error");
                return;
            }

            setCurrentUser(match);
            window.location.href = "home.html";
        });

        signupForm?.addEventListener("submit", (event) => {
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
            if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
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

    window.Daydreamers = window.Daydreamers || {};
    window.Daydreamers.auth = { getCurrentUser, handleAuthForms };
}());

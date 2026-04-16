document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorMsg = document.getElementById("error-message");

            try {
                const res = await fetch("/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (res.status === 201) {
                    window.location.href = "index.html"; // redirect to login
                } else {
                    const text = await res.text();
                    errorMsg.innerText = text;
                    errorMsg.style.display = "block";
                }
            } catch (err) {
                errorMsg.innerText = "Network error. Please try again.";
                errorMsg.style.display = "block";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorMsg = document.getElementById("error-message");

            try {
                const res = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const text = await res.text();
                
                if (res.status === 200 && text === "Login success") {
                    window.location.href = "dashboard.html";
                } else {
                    errorMsg.innerText = text;
                    errorMsg.style.display = "block";
                }
            } catch (err) {
                errorMsg.innerText = "Network error. Please try again.";
                errorMsg.style.display = "block";
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const switchToRegister = document.getElementById("switch-to-register");
    const switchToLogin = document.getElementById("switch-to-login");

    switchToRegister.addEventListener("click", function (e) {
        e.preventDefault();
        loginForm.classList.remove("active-form");
        registerForm.classList.add("active-form");
    });

    switchToLogin.addEventListener("click", function (e) {
        e.preventDefault();
        registerForm.classList.remove("active-form");
        loginForm.classList.add("active-form");
    });
});

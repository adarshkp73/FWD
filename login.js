document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("usr");
    const passInput = document.getElementById("pass");
    const loginButton = document.getElementById("login-button");
    
    let errorElement = document.createElement("p");
    errorElement.className = "login-error";
    
    loginForm.insertBefore(errorElement, loginButton); 

    loginForm.addEventListener("submit", (event) => {
        
        event.preventDefault(); 
        
        errorElement.textContent = "";

        if (!emailInput.checkValidity()) {
            errorElement.textContent = "Please enter a valid email address (e.g., example@domain.com).";
            return; 
        }

        if (!passInput.checkValidity()) {
            errorElement.textContent = "Password must be at least 8 characters long.";
            return; 
        }

        //todo user auth we'll do later with backend
        errorElement.textContent = "Login successful! Redirecting...";
        errorElement.style.color = "#A7DCA4"; 

        //putting delay to fake login time lol
        setTimeout(() => {
            window.location.href = "main.html";
        }, 1000);
    });
});